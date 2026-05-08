'use client';

import { changePasswordAction } from '@/lib/actions/account-actions';
import { changePasswordSchema } from '@/lib/schemas/account';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { PasswordField } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/ui/banner';

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
      <PasswordField name="newPassword" label="New password" autoComplete="new-password" placeholder="At least 6 characters" required />
      <PasswordField name="confirmPassword" label="Confirm new password" autoComplete="new-password" required />
      {form.error ? <Banner variant="error">{form.error}</Banner> : null}
      {form.info ? <Banner variant="success">{form.info}</Banner> : null}
      <Button type="submit" disabled={form.pending}>
        {form.pending ? 'Updating...' : 'Change password'}
      </Button>
    </form>
  );
}
