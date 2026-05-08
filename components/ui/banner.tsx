import { cn } from '@/lib/utils';

type Variant = 'info' | 'error' | 'warning' | 'success';

const styles: Record<Variant, string> = {
  info: 'border-brand-200 bg-brand-50 text-brand-800',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
};

export function Banner({
  variant = 'info',
  size = 'sm',
  className,
  children,
}: {
  variant?: Variant;
  size?: 'xs' | 'sm';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-2xl border px-4 py-3',
        size === 'xs' ? 'text-xs' : 'text-sm',
        styles[variant],
        className,
      )}
    >
      {children}
    </p>
  );
}
