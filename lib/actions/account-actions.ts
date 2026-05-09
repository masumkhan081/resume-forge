'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import mongoose, { Types } from 'mongoose';
import { signOut } from '@/auth';
import { connectMongo } from '@/lib/mongodb';
import { User } from '@/lib/models/user';
import { Resume } from '@/lib/models/resume';
import { PasswordResetToken } from '@/lib/models/password-reset-token';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { failure, success } from '@/lib/types/api';
import { env } from '@/lib/env';
import { logger, captureException } from '@/lib/logger';
import { sendPasswordChangedEmail, sendAccountDeletedEmail } from '@/lib/email';
import { authed } from './utils';
import {
  changePasswordServerSchema,
  deleteAccountSchema,
  updateNameSchema,
  type ChangePasswordServerInput,
  type DeleteAccountInput,
  type UpdateNameInput,
} from '@/lib/schemas/account';

export async function updateProfileNameAction(input: UpdateNameInput) {
  return authed(updateNameSchema, input, async (data, session) => {
    await connectMongo();
    await User.updateOne(
      { _id: new Types.ObjectId(session.userId) },
      { name: data.name.trim() },
    );
    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return success({ name: data.name }, 'Name updated.');
  });
}

export async function changePasswordAction(input: ChangePasswordServerInput) {
  return authed(changePasswordServerSchema, input, async (data, session) => {
    await connectMongo();

    const userId = new Types.ObjectId(session.userId);
    const user = await User.findById(userId).select('_id email passwordHash').lean();
    if (!user) return failure('NOT_FOUND', 'Account not found.');
    if (!user.passwordHash) {
      return failure(
        'NO_PASSWORD',
        'This account uses a third-party sign-in. Set a password via recovery first.',
      );
    }

    const valid = await verifyPassword(data.currentPassword, user.passwordHash);
    if (!valid) {
      return failure('INVALID_CREDENTIALS', 'Current password is incorrect.');
    }

    const newHash = await hashPassword(data.newPassword);
    await User.updateOne({ _id: user._id }, { passwordHash: newHash });

    try {
      await sendPasswordChangedEmail({
        to: user.email,
        recoveryUrl: `${env.NEXT_PUBLIC_BASE_URL}/auth/recovery`,
      });
    } catch (error) {
      captureException(error, {
        action: 'changePasswordAction.email',
        userId: user._id.toString(),
      });
    }

    logger.info('user.password_changed', { userId: user._id.toString() });
    return success(
      { ok: true },
      'Password updated. Other devices stay signed in until their session expires.',
    );
  });
}

export async function deleteAccountAction(input: DeleteAccountInput) {
  return authed(deleteAccountSchema, input, async (data, session) => {
    if (data.confirmation.trim().toLowerCase() !== session.email.toLowerCase()) {
      return failure('CONFIRMATION_MISMATCH', 'Confirmation does not match your email.');
    }

    await connectMongo();
    const userId = new Types.ObjectId(session.userId);
    const userEmail = session.email;

    const dbSession = await mongoose.startSession();
    try {
      await dbSession.withTransaction(async () => {
        await Resume.deleteMany({ userId }).session(dbSession);
        await PasswordResetToken.deleteMany({ userId }).session(dbSession);
        await User.deleteOne({ _id: userId }).session(dbSession);
      });
    } finally {
      await dbSession.endSession();
    }

    await signOut({ redirect: false });

    try {
      await sendAccountDeletedEmail({ to: userEmail });
    } catch (error) {
      captureException(error, { action: 'deleteAccountAction.email' });
    }

    logger.info('user.account_deleted', { email: userEmail });
    return success({ ok: true }, 'Account deleted.');
  });
}

export async function deleteAccountAndRedirect(input: DeleteAccountInput) {
  const result = await deleteAccountAction(input);
  if (!result.ok) return result;
  redirect('/');
}
