import { cn } from '@/lib/utils';

export function SectionLabel({
  title,
  instruction,
  count,
  limit,
  className,
}: {
  title: string;
  instruction?: string;
  count?: number;
  limit?: number;
  className?: string;
}) {
  const showCounter = typeof count === 'number';
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{title}</h3>
      {instruction ? (
        <span className="text-xs leading-5 text-slate-500">{instruction}</span>
      ) : null}
      {showCounter ? (
        <span className="ml-auto inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800">
          {count}
          {typeof limit === 'number' ? ` / ${limit}` : null}
        </span>
      ) : null}
    </div>
  );
}
