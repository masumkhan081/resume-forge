'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteAccountAction } from '@/lib/actions/account-actions';
import { Field } from '@/components/ui/field';
import { Banner } from '@/components/ui/banner';
import { cn } from '@/lib/utils';

export function DeleteAccountForm({ email }: { email: string }) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const matches = confirmation.trim().toLowerCase() === email.toLowerCase();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!matches) {
      setError(`Type "${email}" to confirm.`);
      return;
    }
    startTransition(async () => {
      const result = await deleteAccountAction({ confirmation });
      if (result.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm leading-6 text-slate-600">
        This will delete your account and all of your resumes. There is no
        recovery. Type <span className="font-medium text-ink">{email}</span> below
        to confirm.
      </p>
      <Field
        name="confirmation"
        label={`Type "${email}"`}
        value={confirmation}
        onChange={(event) => {
          setConfirmation(event.target.value);
          if (error) setError('');
        }}
        placeholder={email}
        autoComplete="off"
      />
      {error ? <Banner variant="error">{error}</Banner> : null}
      <button
        type="submit"
        disabled={!matches || pending}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition',
          matches
            ? 'bg-rose-700 text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60'
            : 'cursor-not-allowed bg-slate-200 text-slate-500',
        )}
      >
        {pending ? 'Deleting...' : 'Delete my account'}
      </button>
    </form>
  );
}
