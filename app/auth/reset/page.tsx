'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordAction } from '@/lib/actions/session-actions';
import { resetSchema } from '@/lib/schemas/auth';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { AuthHeader } from '@/components/auth/auth-header';
import { Banner } from '@/components/ui/banner';
import { PasswordField } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export default function ResetPage() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';

  const form = useZodForm({
    schema: resetSchema,
    action: resetPasswordAction,
    onSuccess: () => router.push('/auth/login'),
  });

  function handleSubmit(formData: FormData) {
    form.submit({
      token,
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });
  }

  return (
    <>
      <AuthHeader
        eyebrow="New password"
        title="Set a new password"
        description={"Choose something memorable. After this you'll be sent back to log in with the new credentials."}
      />

      <form action={handleSubmit} className="space-y-4">
        <PasswordField name="password" label="New password" placeholder="At least 6 characters" autoComplete="new-password" required />
        <PasswordField name="confirmPassword" label="Confirm password" placeholder="Type it again" autoComplete="new-password" required />

        {!token ? (
          <Banner variant="warning" size="xs">
            This page is meant to be opened from the recovery link in your email. Without a valid token the action will fail.
          </Banner>
        ) : null}

        {form.error ? <Banner variant="error">{form.error}</Banner> : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={form.pending} className="w-full sm:w-auto">
            {form.pending ? 'Updating...' : 'Update password'}
          </Button>
          <p className="text-xs leading-5 text-slate-500">
            Changed your mind?{' '}
            <Link href="/auth/login" className="font-medium text-brand-700 hover:text-brand-800">
              Back to log in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
