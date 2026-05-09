'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './button';

type SubmitButtonProps = {
  pending: boolean;
  pendingLabel?: string;
  disabled?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled' | 'children'>;

export function SubmitButton({
  pending,
  pendingLabel = 'Submitting...',
  disabled,
  children,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={className}
      {...props}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
