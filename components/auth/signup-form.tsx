'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/lib/actions/session-actions';
import { signupSchema } from '@/lib/schemas/auth';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { PageHeader } from '@/components/ui/page-header';
import { AuthToggler } from '@/components/auth/auth-toggler';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { FormFeedback } from '@/components/ui/form-feedback';
import { Field, PasswordField } from '@/components/ui/field';
import { SubmitButton } from '@/components/ui/submit-button';

export function SignupForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();

  const form = useZodForm({
    schema: signupSchema,
    action: async (data) => signupAction({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
    onSuccess: () => router.push('/dashboard'),
  });

  return (
    <>
      <PageHeader
        eyebrow="Step zero"
        title="Create your account"
        description="Credentials sign-in is typed end-to-end via Auth.js + bcrypt. Google OAuth is optional."
      />
      <AuthToggler />

      {googleEnabled ? (
        <>
          <GoogleSignInButton label="Sign up with Google" />
          <Divider />
        </>
      ) : null}

      <form action={form.handleFormAction} className="space-y-4">
        <Field name="name" label="Name" placeholder="Masum Khan" autoComplete="name" required />
        <Field name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <PasswordField name="password" label="Password" placeholder="At least 8 chars with a letter and a digit" autoComplete="new-password" required />
        <PasswordField name="confirmPassword" label="Confirm password" placeholder="Type it again" autoComplete="new-password" required />

        <FormFeedback error={form.error} />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <SubmitButton pending={form.pending} pendingLabel="Creating..." className="w-full sm:w-auto">
            Create account
          </SubmitButton>
          <p className="text-xs leading-5 text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-brand-700 hover:text-brand-800">
              Log in
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
