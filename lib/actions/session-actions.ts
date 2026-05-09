'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import mongoose, { Types } from 'mongoose';
import { signIn, signOut } from '@/auth';
import { connectMongo } from '@/lib/mongodb';
import { User } from '@/lib/models/user';
import { PasswordResetToken } from '@/lib/models/password-reset-token';
import { hashPassword } from '@/lib/auth/password';
import {
  buildResetTokenExpiry,
  generateResetToken,
  hashToken,
} from '@/lib/auth/tokens';
import { failure, success } from '@/lib/types/api';
import { env } from '@/lib/env';
import { logger, captureException } from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email';
import { validated } from './utils';
import {
  loginSchema,
  otpSchema,
  recoverySchema,
  resetSchema,
  signupServerSchema,
  type LoginInput,
  type OtpInput,
  type RecoveryInput,
  type ResetInput,
  type SignupServerInput,
} from '@/lib/schemas/auth';

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_LOGIN = 5;
const RATE_MAX_SIGNUP = 5;
const RATE_MAX_RECOVERY = 3;

async function clientKey(prefix: string) {
  const h = await headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'local';
  return `${prefix}:${ip}`;
}

function rateLimitFailure(retryAfterMs: number) {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return failure('RATE_LIMITED', `Too many attempts. Try again in ${seconds}s.`);
}

export async function signupAction(input: SignupServerInput) {
  return validated(signupServerSchema, input, async (data) => {
    const limit = rateLimit({
      key: await clientKey('signup'),
      windowMs: RATE_WINDOW_MS,
      max: RATE_MAX_SIGNUP,
    });
    if (!limit.ok) return rateLimitFailure(limit.retryAfterMs);

    const email = data.email.toLowerCase().trim();
    try {
      await connectMongo();

      const existing = await User.findOne({ email }).select('_id').lean();
      if (existing) {
        return failure('EMAIL_TAKEN', 'An account with that email already exists.');
      }

      const passwordHash = await hashPassword(data.password);

      const user = await User.create({
        email,
        name: data.name,
        passwordHash,
      });

      logger.info('user.signup', { userId: user._id.toString() });

      try {
        await signIn('credentials', {
          email,
          password: data.password,
          redirect: false,
        });
      } catch (signInError) {
        captureException(signInError, { action: 'signupAction.signIn', email });
        return failure('INTERNAL', 'Account created, but auto sign-in failed. Please log in.');
      }

      await sendWelcomeEmail({
        to: email,
        fullName: data.name,
        dashboardUrl: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      });

      return success(
        { userId: user._id.toString(), email, name: data.name },
        'Account created.',
      );
    } catch (error) {
      captureException(error, { action: 'signupAction', email });
      return failure('INTERNAL', 'Something went wrong. Please try again.');
    }
  });
}

export async function loginAction(input: LoginInput) {
  return validated(loginSchema, input, async (data) => {
    const limit = rateLimit({
      key: await clientKey('login'),
      windowMs: RATE_WINDOW_MS,
      max: RATE_MAX_LOGIN,
    });
    if (!limit.ok) return rateLimitFailure(limit.retryAfterMs);

    try {
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      logger.info('user.login', { email: data.email });
      return success({ email: data.email }, 'Signed in.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('CredentialsSignin') || message.includes('configuration')) {
        return failure('INVALID_CREDENTIALS', 'Email or password is incorrect.');
      }
      captureException(error, { action: 'loginAction', email: data.email });
      return failure('INVALID_CREDENTIALS', 'Email or password is incorrect.');
    }
  });
}

export async function requestPasswordRecovery(input: RecoveryInput) {
  return validated(recoverySchema, input, async (data) => {
    const limit = rateLimit({
      key: await clientKey('recovery'),
      windowMs: RATE_WINDOW_MS,
      max: RATE_MAX_RECOVERY,
    });
    if (!limit.ok) return rateLimitFailure(limit.retryAfterMs);

    const email = data.email.toLowerCase().trim();
    const genericSuccess = success(
      { email },
      'If an account exists for that email, a recovery link is on its way.',
    );

    try {
      await connectMongo();

      const user = await User.findOne({ email }).select('_id email').lean();
      if (!user) return genericSuccess;

      const { plain, hash } = generateResetToken();
      const expiresAt = buildResetTokenExpiry();

      await PasswordResetToken.deleteMany({ userId: user._id });
      await PasswordResetToken.create({
        userId: user._id,
        tokenHash: hash,
        expiresAt,
      });

      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: `${env.NEXT_PUBLIC_BASE_URL}/auth/reset?token=${plain}`,
      });

      logger.info('user.password_recovery_requested', { userId: user._id.toString() });
      return genericSuccess;
    } catch (error) {
      captureException(error, { action: 'requestPasswordRecovery', email });
      return genericSuccess;
    }
  });
}

export async function verifyOtpAction(input: OtpInput) {
  return validated(otpSchema, input, async (data) => {
    if (data.code !== '000000') {
      return failure('INVALID_OTP', 'That code does not match. (Demo: use 000000.)');
    }
    return success({ email: data.email }, 'Email verified.');
  });
}

export async function resetPasswordAction(input: ResetInput) {
  return validated(resetSchema, input, async (data) => {
    try {
      await connectMongo();

      const tokenHash = hashToken(data.token);
      const record = await PasswordResetToken.findOne({ tokenHash }).lean();

      if (!record || record.expiresAt < new Date()) {
        return failure(
          'INVALID_RESET',
          'This reset link is invalid or has expired. Request a new one.',
        );
      }

      const newHash = await hashPassword(data.password);

      const dbSession = await mongoose.startSession();
      try {
        await dbSession.withTransaction(async () => {
          await User.updateOne(
            { _id: record.userId },
            { passwordHash: newHash },
          ).session(dbSession);
          await PasswordResetToken.deleteOne({ _id: record._id }).session(dbSession);
        });
      } finally {
        await dbSession.endSession();
      }

      logger.info('user.password_reset', { userId: record.userId.toString() });
      return success({ ok: true }, 'Password updated. Sign in with your new password.');
    } catch (error) {
      captureException(error, { action: 'resetPasswordAction' });
      return failure('INTERNAL', 'Could not reset password. Please try again.');
    }
  });
}

export async function signOutAction() {
  await signOut({ redirect: false });
  return success({ ok: true }, 'Signed out.');
}

export async function signOutAndRedirect() {
  await signOut({ redirect: false });
  redirect('/');
}

export async function signInWithGoogleAction(redirectTo?: string) {
  await signIn('google', { redirectTo: redirectTo ?? '/dashboard' });
}

void Types;
