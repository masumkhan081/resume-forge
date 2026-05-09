'use client';

import Link from 'next/link';
import { requestPasswordRecovery } from '@/lib/actions/session-actions';
import { recoverySchema } from '@/lib/schemas/auth';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { PageHeader } from '@/components/ui/page-header';
import { FormFeedback } from '@/components/ui/form-feedback';
import { Field } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';

export default function RecoveryPage() {
  const form = useZodForm({
    schema: recoverySchema,
    action: requestPasswordRecovery,
  });

  return (
    <>
      <PageHeader
        eyebrow="Account recovery"
        title="Reset your password"
        description={"Enter the email tied to your account. We'll send a link to set a new password."}
      />

      <form action={form.handleFormAction} className="space-y-4">
        <Field name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />

        <FormFeedback error={form.error} info={form.info} />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <SubmitButton pending={form.pending} pendingLabel="Sending..." className="w-full sm:w-auto">
            Send recovery link
          </SubmitButton>
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
