'use client';

import { changePasswordAction } from '@/lib/actions/account-actions';
import { changePasswordSchema } from '@/lib/schemas/account';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { PasswordField } from '@/components/ui/field';
import { FormFeedback } from '@/components/ui/form-feedback';
import { SubmitButton } from '@/components/ui/submit-button';

export function ChangePasswordForm() {
  const form = useZodForm({
    schema: changePasswordSchema,
    action: async (data) => changePasswordAction({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
  });

  return (
    <form action={form.handleFormAction} className="space-y-4">
      <PasswordField name="currentPassword" label="Current password" autoComplete="current-password" required />
      <PasswordField name="newPassword" label="New password" autoComplete="new-password" placeholder="At least 8 characters with a letter and a digit" required />
      <PasswordField name="confirmPassword" label="Confirm new password" autoComplete="new-password" required />
      <FormFeedback error={form.error} success={form.info} />
      <SubmitButton pending={form.pending} pendingLabel="Updating...">
        Change password
      </SubmitButton>
    </form>
  );
}
