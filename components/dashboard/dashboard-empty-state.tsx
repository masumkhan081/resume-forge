import { FileDown, FileText, LayoutTemplate, PencilRuler } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';

export function DashboardEmptyState() {
  return (
    <Card className="mt-6 overflow-hidden p-6 sm:p-10">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="rounded-2xl bg-brand-100 p-3 text-brand-800">
          <FileText className="h-6 w-6" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">
            Build your first resume
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Pick a starting point. Start blank to write your own from scratch, or
            seed with a sample resume to see the structure before customising it.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <LinkButton href="/builder/new">Start blank</LinkButton>
          <LinkButton href="/builder/new-sample" variant="ghost">
            Use a sample to start
          </LinkButton>
        </div>
      </div>

      <div className="mt-10 grid gap-5 border-t border-slate-100 pt-8 sm:grid-cols-3 sm:gap-4">
        <Pillar
          icon={<PencilRuler className="h-4 w-4" />}
          title="Multi-step builder"
          body="Five focused sections: basics, skills, experience, projects, review."
        />
        <Pillar
          icon={<LayoutTemplate className="h-4 w-4" />}
          title="Three templates"
          body="Switch any time without re-entering content."
        />
        <Pillar
          icon={<FileDown className="h-4 w-4" />}
          title="PDF export"
          body="Rendered in your browser. Download, share, done."
        />
      </div>
    </Card>
  );
}

function Pillar({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
        <span className="rounded-md bg-brand-50 p-1 text-brand-800">{icon}</span>
        {title}
      </div>
      <p className="text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
