'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '@/lib/actions/session-actions';
import { loginSchema } from '@/lib/schemas/auth';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthToggler } from '@/components/auth/auth-toggler';
import { Banner } from '@/components/ui/banner';
import { Field, PasswordField } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '/builder';

  const form = useZodForm({
    schema: loginSchema,
    action: loginAction,
    onSuccess: () => router.push(next),
  });

  return (
    <>
      <AuthHeader
        eyebrow="Welcome back"
        title="Log in to keep building"
        description="Pick up your draft right where you left off. The session is local-first and ready to swap to a real auth provider later."
      />
      <AuthToggler />

      <form action={form.handleFormAction} className="space-y-4">
        <Field name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <PasswordField name="password" label="Password" placeholder="At least 6 characters" autoComplete="current-password" required />

        <div className="flex items-center justify-between text-sm">
          <Link href="/auth/recovery" className="text-brand-700 transition hover:text-brand-800">
            Forgot your password?
          </Link>
        </div>

        {form.error ? <Banner variant="error">{form.error}</Banner> : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={form.pending} className="w-full sm:w-auto">
            {form.pending ? 'Signing in...' : 'Log in'}
          </Button>
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
