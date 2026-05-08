'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Banner } from '@/components/ui/banner';
import { LinkButton } from '@/components/ui/link-button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full space-y-4 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Something broke
        </p>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
          We hit an unexpected error.
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          Try again, or head back home and start fresh. Your draft is still in
          local storage.
        </p>
        {error.digest ? (
          <Banner variant="warning" size="xs" className="text-left">
            Reference id: <code className="font-mono">{error.digest}</code>
          </Banner>
        ) : null}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            Try again
          </button>
          <LinkButton href="/" variant="secondary">Go home</LinkButton>
        </div>
      </Card>
    </main>
  );
}
