'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { renameResumeAction } from '@/lib/actions/resume-actions';
import { Pencil } from 'lucide-react';

export function RenameResumeForm({
  id,
  initialName,
}: {
  id: string;
  initialName: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function commit() {
    if (name.trim() === initialName) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      const result = await renameResumeAction({ id, name });
      if (result.ok) {
        setEditing(false);
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        title={initialName}
        onClick={() => {
          setEditing(true);
          setError('');
        }}
        className="inline-flex w-full max-w-full items-center gap-1.5 text-left text-base font-semibold text-ink hover:text-brand-700"
      >
        <span className="truncate">{initialName}</span>
        <Pencil className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        commit();
      }}
      className="space-y-2"
    >
      <input
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={commit}
        disabled={pending}
        className="h-10 w-full rounded-full border border-slate-200 bg-white px-3 text-sm text-ink focus:border-brand-300 focus:outline-none"
      />
      {error ? <span className="block text-xs text-rose-700">{error}</span> : null}
    </form>
  );
}
