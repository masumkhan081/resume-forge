import { z } from 'zod';
import { confirmPasswordField, fullNameField, passwordField } from './auth';

export const updateNameSchema = z.object({
  fullName: fullNameField,
});
export type UpdateNameInput = z.infer<typeof updateNameSchema>;

const changePasswordBase = z.object({
  currentPassword: passwordField,
  newPassword: passwordField,
});

export const changePasswordServerSchema = changePasswordBase;
export type ChangePasswordServerInput = z.infer<typeof changePasswordServerSchema>;

export const changePasswordSchema = changePasswordBase
  .extend({
    confirmPassword: confirmPasswordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from your current password.',
    path: ['newPassword'],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  confirmation: z.string().min(1, 'Type your email to confirm.'),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
