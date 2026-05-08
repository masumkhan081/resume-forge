'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { verifyOtpAction } from '@/lib/actions/session-actions';
import { otpSchema } from '@/lib/schemas/auth';
import { AuthHeader } from '@/components/auth/auth-header';
import { OtpInput } from '@/components/auth/otp-input';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';

const OTP_LENGTH = 6;

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(submission: string) {
    const parsed = otpSchema.safeParse({ email, code: submission });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter all 6 digits.');
      return;
    }

    setPending(true);
    setError('');

    const result = await verifyOtpAction(parsed.data);

    if (!result.ok) {
      setError(result.error.message);
      setPending(false);
      return;
    }

    router.push('/builder');
  }

  return (
    <>
      <AuthHeader
        eyebrow="Verify your email"
        title="Enter the 6-digit code"
        description={
          email ? (
            <>
              We sent a code to{' '}
              <span className="font-medium text-ink">{email}</span>. It expires
              in 15 minutes. <span className="text-slate-500">(Demo: use 000000.)</span>
            </>
          ) : (
            'Check your email for the verification code. (Demo: use 000000.)'
          )
        }
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(code);
        }}
        className="space-y-5"
      >
        <OtpInput
          value={code}
          onChange={(next) => {
            setCode(next);
            if (error) setError('');
          }}
          onComplete={(complete) => submit(complete)}
          disabled={pending}
        />

        {error ? <Banner variant="error">{error}</Banner> : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={pending || code.length !== OTP_LENGTH}
            className="w-full sm:w-auto"
          >
            {pending ? 'Verifying...' : 'Verify and continue'}
          </Button>
          <p className="text-xs leading-5 text-slate-500">
            Wrong email?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-brand-700 hover:text-brand-800"
            >
              Start over
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
