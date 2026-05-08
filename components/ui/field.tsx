'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          className={cn(
            'min-h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-300 focus:bg-white',
            error && 'border-rose-300 bg-rose-50',
            className,
          )}
          {...props}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            'h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-ink placeholder:text-slate-400 focus:border-brand-300 focus:bg-white',
            error && 'border-rose-300 bg-rose-50',
            className,
          )}
          {...props}
        />
      )}
      {error ? (
        <span className="block text-xs text-rose-700">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-slate-500">{hint}</span>
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
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn(
            'h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-4 pr-12 text-sm text-ink placeholder:text-slate-400 focus:border-brand-300 focus:bg-white',
            error && 'border-rose-300 bg-rose-50',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <span className="block text-xs text-rose-700">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
