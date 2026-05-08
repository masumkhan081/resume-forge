'use client';

import { useState, useTransition } from 'react';
import { deleteResumeAction } from '@/lib/actions/resume-actions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function DeleteResumeButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    startTransition(async () => {
      const result = await deleteResumeAction({ id });
      if (result.ok) {
        router.refresh();
      } else {
        setConfirming(false);
        alert(result.error.message);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60',
        confirming
          ? 'border-rose-300 bg-rose-100 text-rose-800'
          : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700',
      )}
    >
      {pending ? 'Deleting...' : confirming ? 'Click again to confirm' : 'Delete'}
    </button>
  );
}
