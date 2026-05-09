import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-5 py-3 text-sm',
};

const variantStyles: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
  ghost:
    'border border-brand-200 bg-brand-50 text-brand-800 hover:border-brand-300 hover:bg-brand-100',
};

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>;

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(base, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
