'use client';

import { useTransition } from 'react';
import { signInWithGoogleAction } from '@/lib/actions/session-actions';
import { cn } from '@/lib/utils';

export function GoogleSignInButton({
  callbackUrl,
  label = 'Continue with Google',
}: {
  callbackUrl?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => signInWithGoogleAction(callbackUrl))}
      disabled={pending}
      className={cn(
        'inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60',
      )}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M21.6 12.227c0-.79-.071-1.55-.204-2.282H12v4.317h5.388c-.232 1.252-.937 2.313-1.997 3.025v2.512h3.232c1.892-1.741 2.977-4.305 2.977-7.572z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.7 0 4.964-.895 6.619-2.42l-3.232-2.512c-.896.601-2.041.957-3.387.957-2.605 0-4.81-1.76-5.597-4.124H3.062v2.595A9.996 9.996 0 0 0 12 22z"
          fill="#34A853"
        />
        <path
          d="M6.403 13.901a5.999 5.999 0 0 1 0-3.802V7.504H3.062a10.008 10.008 0 0 0 0 8.992l3.341-2.595z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.974c1.469 0 2.786.505 3.823 1.498l2.866-2.866C16.961 3.024 14.696 2 12 2A9.996 9.996 0 0 0 3.062 7.504l3.341 2.595C7.19 7.735 9.395 5.974 12 5.974z"
          fill="#EA4335"
        />
      </svg>
      {pending ? 'Redirecting...' : label}
    </button>
  );
}
