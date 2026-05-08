'use client';

import Link from 'next/link';
import { requestPasswordRecovery } from '@/lib/actions/session-actions';
import { recoverySchema } from '@/lib/schemas/auth';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { AuthHeader } from '@/components/auth/auth-header';
import { Banner } from '@/components/ui/banner';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export default function RecoveryPage() {
  const form = useZodForm({
    schema: recoverySchema,
    action: requestPasswordRecovery,
  });

  return (
    <>
      <AuthHeader
        eyebrow="Account recovery"
        title="Reset your password"
        description={"Enter the email tied to your account. We'll send a link to set a new password."}
      />

      <form action={form.handleFormAction} className="space-y-4">
        <Field name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />

        {form.error ? <Banner variant="error">{form.error}</Banner> : null}
        {form.info ? <Banner variant="info">{form.info}</Banner> : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={form.pending} className="w-full sm:w-auto">
            {form.pending ? 'Sending...' : 'Send recovery link'}
          </Button>
          <p className="text-xs leading-5 text-slate-500">
            Remembered it?{' '}
            <Link href="/auth/login" className="font-medium text-brand-700 hover:text-brand-800">
              Back to log in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
