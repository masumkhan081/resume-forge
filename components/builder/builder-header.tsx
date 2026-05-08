import { Card } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';

export function BuilderHeader({
  name,
  step,
  progress,
}: {
  name: string;
  step: string;
  progress: number;
}) {
  const completionText = `${Math.round(progress)}% complete`;
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 sm:text-sm">
            Editing
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">{name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Five focused steps — basics, skills, experience, projects, review. Save anytime; the resume is stored against your account.
          </p>
        </div>
        <LinkButton href="/dashboard" variant="secondary" size="sm">
          Dashboard
        </LinkButton>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
          <span>{step}</span>
          <span>{completionText}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-700 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Card>
  );
}
