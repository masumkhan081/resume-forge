'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '@/lib/actions/session-actions';
import { loginSchema } from '@/lib/schemas/auth';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { PageHeader } from '@/components/ui/page-header';
import { AuthToggler } from '@/components/auth/auth-toggler';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { FormFeedback } from '@/components/ui/form-feedback';
import { Field, PasswordField } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const callbackUrl = useSearchParams().get('callbackUrl') ?? '/dashboard';

  const form = useZodForm({
    schema: loginSchema,
    action: loginAction,
    onSuccess: () => router.push(callbackUrl),
  });

  return (
    <>
      <PageHeader
        eyebrow="Welcome back"
        title="Log in to keep building"
        description="Pick up your draft right where you left off. Sessions are JWT-based via Auth.js — fast and stateless."
      />
      <AuthToggler />

      {googleEnabled ? (
        <>
          <GoogleSignInButton callbackUrl={callbackUrl} />
          <Divider />
        </>
      ) : null}

      <form action={form.handleFormAction} className="space-y-4">
        <Field name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <PasswordField name="password" label="Password" placeholder="At least 8 characters" autoComplete="current-password" required />

        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/recovery" className="text-brand-700 transition hover:text-brand-800">
            Forgot your password?
          </Link>
        </div>

        <FormFeedback error={form.error} />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <SubmitButton pending={form.pending} pendingLabel="Signing in..." className="w-full sm:w-auto">
            Log in
          </SubmitButton>
          <p className="text-xs leading-5 text-slate-500">
            New here?{' '}
            <Link href="/auth/signup" className="font-medium text-brand-700 hover:text-brand-800">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
      <div className="h-px flex-1 bg-slate-200" />
      or
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
