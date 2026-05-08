'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { SESSION_COOKIE, SESSION_TTL_DAYS } from '@/lib/auth/constants';
import { failure, success } from '@/lib/types/api';
import { isProd } from '@/lib/env';
import { logger, captureException } from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';
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

const MAX_SESSIONS_PER_USER = 10;
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

async function writeSessionCookie(sessionId: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    secure: isProd,
  });
}

function buildExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_TTL_DAYS);
  return expires;
}

async function pruneSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId, expiresAt: { lt: new Date() } },
  });
  const count = await prisma.session.count({ where: { userId } });
  if (count > MAX_SESSIONS_PER_USER) {
    const surplus = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: count - MAX_SESSIONS_PER_USER,
      select: { id: true },
    });
    if (surplus.length > 0) {
      await prisma.session.deleteMany({
        where: { id: { in: surplus.map((s) => s.id) } },
      });
    }
  }
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
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return failure('EMAIL_TAKEN', 'An account with that email already exists.');
      }

      const passwordHash = await hashPassword(data.password);
      const expiresAt = buildExpiry();

      const user = await prisma.user.create({
        data: {
          email,
          fullName: data.fullName,
          passwordHash,
          sessions: { create: { expiresAt } },
        },
        include: { sessions: { orderBy: { createdAt: 'desc' }, take: 1 } },
      });

      await writeSessionCookie(user.sessions[0].id, expiresAt);
      logger.info('user.signup', { userId: user.id });

      return success(
        { userId: user.id, email: user.email, fullName: user.fullName },
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

    const email = data.email.toLowerCase().trim();
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return failure('INVALID_CREDENTIALS', 'Email or password is incorrect.');
      }

      const valid = await verifyPassword(data.password, user.passwordHash);
      if (!valid) {
        logger.warn('user.login.invalid_password', { userId: user.id });
        return failure('INVALID_CREDENTIALS', 'Email or password is incorrect.');
      }

      await pruneSessions(user.id);

      const expiresAt = buildExpiry();
      const session = await prisma.session.create({
        data: { userId: user.id, expiresAt },
      });

      await writeSessionCookie(session.id, expiresAt);
      logger.info('user.login', { userId: user.id });

      return success({ userId: user.id, email: user.email }, 'Signed in.');
    } catch (error) {
      captureException(error, { action: 'loginAction', email });
      return failure('INTERNAL', 'Something went wrong. Please try again.');
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

    return success(
      { email: data.email },
      'If an account exists for that email, a recovery link is on its way.',
    );
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
  return validated(resetSchema, input, async () => {
    return success({ ok: true }, 'Password updated. Sign in with your new password.');
  });
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }
  cookieStore.delete(SESSION_COOKIE);
  return success({ ok: true }, 'Signed out.');
}

export async function signOutAndRedirect() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }
  cookieStore.delete(SESSION_COOKIE);
  redirect('/');
}
