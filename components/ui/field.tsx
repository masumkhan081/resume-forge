'use client';

import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputBase =
  'h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-ink placeholder:text-slate-400 focus-visible:border-brand-300 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/50';

const textareaBase =
  'min-h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus-visible:border-brand-300 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/50';

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  className?: string;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Field({
  label,
  name,
  type = 'text',
  placeholder,
  textarea = false,
  className,
  hint,
  error,
  ...props
}: FieldProps) {
  const reactId = useId();
  const errorId = error ? `${reactId}-error` : undefined;
  const hintId = !error && hint ? `${reactId}-hint` : undefined;
  const describedBy = errorId ?? hintId;

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(textareaBase, error && 'border-rose-300 bg-rose-50', className)}
          {...props}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(inputBase, error && 'border-rose-300 bg-rose-50', className)}
          {...props}
        />
      )}
      {error ? (
        <span id={errorId} role="alert" className="block text-xs text-rose-700">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="block text-xs text-slate-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

type PasswordFieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  hint?: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function PasswordField({
  label,
  name,
  placeholder,
  className,
  hint,
  error,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const reactId = useId();
  const errorId = error ? `${reactId}-error` : undefined;
  const hintId = !error && hint ? `${reactId}-hint` : undefined;
  const describedBy = errorId ?? hintId;

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-4 pr-12 text-sm text-ink placeholder:text-slate-400 focus-visible:border-brand-300 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300/50',
            error && 'border-rose-300 bg-rose-50',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-1"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <span id={errorId} role="alert" className="block text-xs text-rose-700">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="block text-xs text-slate-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
