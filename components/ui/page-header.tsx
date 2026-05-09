import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 sm:items-center',
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 sm:text-sm">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {description ? (
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
