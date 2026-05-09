'use client';

import { useFormContext } from 'react-hook-form';
import { Field } from './field';

type CommonProps = {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  className?: string;
  hint?: string;
  autoComplete?: string;
};

function getMessage(
  errors: Record<string, unknown> | undefined,
  path: string,
): string | undefined {
  if (!errors) return undefined;
  const parts = path.split('.');
  let current: unknown = errors;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  if (current && typeof current === 'object' && 'message' in current) {
    const message = (current as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
}

export function RhfField({ name, ...rest }: CommonProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = getMessage(errors as Record<string, unknown>, name);
  return <Field {...rest} {...register(name)} error={error} />;
}
