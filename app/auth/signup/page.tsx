'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/lib/actions/session-actions';
import { signupSchema } from '@/lib/schemas/auth';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthToggler } from '@/components/auth/auth-toggler';
import { Banner } from '@/components/ui/banner';
import { Field, PasswordField } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();

  const form = useZodForm({
    schema: signupSchema,
    action: async (data) => signupAction({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    }),
    onSuccess: () => router.push('/builder'),
  });

  return (
    <>
      <AuthHeader
        eyebrow="Step zero"
        title="Create your account"
        description="Just enough to scope the workspace. The signup action is typed and drops in cleanly when a real auth provider is wired later."
      />
      <AuthToggler />

      <form action={form.handleFormAction} className="space-y-4">
        <Field name="fullName" label="Full name" placeholder="Masum Khan" autoComplete="name" required />
        <Field name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <PasswordField name="password" label="Password" placeholder="At least 6 characters" autoComplete="new-password" required />
        <PasswordField name="confirmPassword" label="Confirm password" placeholder="Type it again" autoComplete="new-password" required />

        {form.error ? <Banner variant="error">{form.error}</Banner> : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={form.pending} className="w-full sm:w-auto">
            {form.pending ? 'Creating...' : 'Create account'}
          </Button>
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
