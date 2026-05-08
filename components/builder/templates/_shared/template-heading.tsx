import { cn } from '@/lib/utils';

type Tone = 'brand' | 'muted' | 'sidebar';

const tones: Record<Tone, string> = {
  brand: 'text-brand-700 tracking-[0.2em]',
  muted: 'text-slate-500 tracking-[0.25em]',
  sidebar: 'text-brand-200 tracking-[0.25em]',
};

export function TemplateHeading({
  children,
  tone = 'brand',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <h2 className={cn('text-xs font-semibold uppercase', tones[tone], className)}>
      {children}
    </h2>
  );
}
