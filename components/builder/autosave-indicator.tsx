'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Check, Loader2, RefreshCw } from 'lucide-react';
import type { AutosaveStatus } from '@/lib/hooks/use-autosave';

export function AutosaveIndicator({
  status,
  errorMessage,
  lastSavedAt,
  onRetry,
}: {
  status: AutosaveStatus;
  errorMessage?: string;
  lastSavedAt: Date | null;
  onRetry?: () => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="inline-flex flex-wrap items-center gap-2"
    >
      {status === 'saving' ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Saving...
        </span>
      ) : status === 'error' ? (
        <>
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-700">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            {errorMessage || 'Save failed.'}
          </span>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <RefreshCw className="h-3 w-3" aria-hidden /> Retry
            </button>
          ) : null}
        </>
      ) : status === 'saved' && lastSavedAt ? (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
          <Check className="h-3.5 w-3.5" aria-hidden /> Saved · {formatRelative(lastSavedAt, now)}
        </span>
      ) : (
        <span className="text-xs text-slate-500">Edits autosave as you type.</span>
      )}
    </span>
  );
}

function formatRelative(then: Date, now: number): string {
  const seconds = Math.max(0, Math.floor((now - then.getTime()) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
