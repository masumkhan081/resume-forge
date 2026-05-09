import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { listResumesAction } from '@/lib/actions/resume-actions';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { FormFeedback } from '@/components/ui/form-feedback';
import { LinkButton } from '@/components/ui/link-button';
import { DashboardEmptyState } from '@/components/dashboard/dashboard-empty-state';
import { DeleteResumeButton } from '@/components/dashboard/delete-resume-button';
import { RenameResumeForm } from '@/components/dashboard/rename-resume-form';
import type { ResumeSummary } from '@/lib/types/resume';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'All of your saved resumes in one place.',
};

const formatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const result = await listResumesAction();
  const total = result.ok ? result.data.total : 0;
  const description =
    total === 0
      ? 'Build, edit, and preview as many resumes as you need.'
      : `${total} resume${total === 1 ? '' : 's'} · build, edit, preview, export.`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Card className="p-5 sm:p-6">
        <PageHeader
          eyebrow="Your workspace"
          title="Resumes"
          description={description}
          action={
            total > 0 ? (
              <LinkButton href="/builder/new" className="w-full sm:w-auto">
                <Plus className="h-4 w-4" /> New resume
              </LinkButton>
            ) : null
          }
        />
      </Card>

      {params.error ? (
        <div className="mt-4">
          <FormFeedback error={params.error} />
        </div>
      ) : null}

      {!result.ok ? (
        <div className="mt-6">
          <FormFeedback error={result.error.message} />
        </div>
      ) : result.data.items.length === 0 ? (
        <DashboardEmptyState />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.items.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}

function ResumeCard({ resume }: { resume: ResumeSummary }) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5">
      <div className="min-w-0 space-y-2">
        <RenameResumeForm id={resume.id} initialName={resume.name} />
        <p className="text-xs uppercase tracking-[0.18em] text-brand-700">
          {resume.template}
        </p>
        <p className="text-xs text-slate-500">
          Updated {formatter.format(new Date(resume.updatedAt))}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <LinkButton href={`/builder/${resume.id}`} size="sm">
          Edit
        </LinkButton>
        <LinkButton href={`/resume/${resume.id}`} size="sm" variant="secondary">
          Preview
        </LinkButton>
        <div className="ml-auto">
          <DeleteResumeButton id={resume.id} />
        </div>
      </div>
    </Card>
  );
}
