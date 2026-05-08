'use client';

import {
  ClipboardEvent,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { cn } from '@/lib/utils';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  autoFocus = true,
}: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const slots = useMemo(() => Array.from({ length }), [length]);

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus();
  }, [autoFocus]);

  function focusAt(index: number) {
    const next = inputs.current[Math.max(0, Math.min(length - 1, index))];
    next?.focus();
    next?.select();
  }

  function commit(next: string) {
    const sanitized = next.replace(/\D/g, '').slice(0, length);
    onChange(sanitized);
    if (sanitized.length === length) onComplete?.(sanitized);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>, index: number) {
    const incoming = event.target.value.replace(/\D/g, '');
    if (!incoming) {
      const arr = value.split('');
      arr[index] = '';
      commit(arr.join(''));
      return;
    }

    const digit = incoming[incoming.length - 1] ?? '';
    const arr = value.padEnd(index, ' ').split('');
    arr[index] = digit;
    commit(arr.join('').replace(/\s/g, ''));
    focusAt(index + 1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === 'Backspace') {
      if (!value[index]) {
        event.preventDefault();
        const arr = value.split('');
        arr[index - 1] = '';
        commit(arr.join(''));
        focusAt(index - 1);
      }
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(index + 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>, index: number) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    event.preventDefault();
    const merged = (value.slice(0, index) + pasted).slice(0, length);
    commit(merged);
    focusAt(Math.min(merged.length, length - 1));
  }

  return (
    <div
      role="group"
      aria-label="One-time code"
      className="flex flex-wrap justify-between gap-2 sm:gap-3"
    >
      {slots.map((_, index) => (
        <input
          key={index}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={value[index] ?? ''}
          onChange={(event) => handleChange(event, index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={(event) => handlePaste(event, index)}
          aria-label={`Digit ${index + 1}`}
          className={cn(
            'h-12 w-10 rounded-2xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-ink',
            'focus:border-brand-300 focus:bg-white focus:outline-none',
            'sm:h-14 sm:w-12 sm:text-xl',
            disabled && 'opacity-60',
          )}
        />
      ))}
    </div>
  );
}
