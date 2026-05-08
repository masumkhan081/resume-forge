'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/auth/constants';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { failure, success } from '@/lib/types/api';
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
    await prisma.user.update({
      where: { id: session.userId },
      data: { fullName: data.fullName.trim() },
    });
    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return success({ fullName: data.fullName }, 'Name updated.');
  });
}

export async function changePasswordAction(input: ChangePasswordServerInput) {
  return authed(changePasswordServerSchema, input, async (data, session) => {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return failure('NOT_FOUND', 'Account not found.');

    const valid = await verifyPassword(data.currentPassword, user.passwordHash);
    if (!valid) {
      return failure('INVALID_CREDENTIALS', 'Current password is incorrect.');
    }

    const newHash = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    await prisma.session.deleteMany({
      where: { userId: user.id, NOT: { id: session.id } },
    });

    return success({ ok: true }, 'Password updated. Other devices have been signed out.');
  });
}

export async function deleteAccountAction(input: DeleteAccountInput) {
  return authed(deleteAccountSchema, input, async (data, session) => {
    if (data.confirmation.trim().toLowerCase() !== session.email.toLowerCase()) {
      return failure('CONFIRMATION_MISMATCH', 'Confirmation does not match your email.');
    }

    await prisma.user.delete({ where: { id: session.userId } });
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);

    return success({ ok: true }, 'Account deleted.');
  });
}

export async function deleteAccountAndRedirect(input: DeleteAccountInput) {
  const result = await deleteAccountAction(input);
  if (!result.ok) return result;
  redirect('/');
}
