import type { Metadata } from 'next';
import { FileText, Plus } from 'lucide-react';
import { listResumesAction } from '@/lib/actions/resume-actions';
import { Card } from '@/components/ui/card';
import { Banner } from '@/components/ui/banner';
import { LinkButton } from '@/components/ui/link-button';
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 sm:text-sm">
            Your workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            Resumes
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Build, edit, and preview as many resumes as you need.
          </p>
        </div>
        <LinkButton href="/builder/new">
          <Plus className="h-4 w-4" /> New resume
        </LinkButton>
      </Card>

      {params.error ? (
        <div className="mt-4">
          <Banner variant="error">{params.error}</Banner>
        </div>
      ) : null}

      {!result.ok ? (
        <div className="mt-6">
          <Banner variant="error">{result.error.message}</Banner>
        </div>
      ) : result.data.items.length === 0 ? (
        <EmptyState />
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

function EmptyState() {
  return (
    <Card className="mt-6 flex flex-col items-center gap-4 p-10 text-center">
      <div className="rounded-2xl bg-brand-100 p-3 text-brand-800">
        <FileText className="h-6 w-6" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-ink">Start your first resume</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          A new resume is seeded with the sample so you can see the structure right
          away. Customise it, save, and download the PDF whenever you&apos;re ready.
        </p>
      </div>
      <LinkButton href="/builder/new">
        <Plus className="h-4 w-4" /> New resume
      </LinkButton>
    </Card>
  );
}

function ResumeCard({ resume }: { resume: ResumeSummary }) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5">
      <div className="space-y-2">
        <RenameResumeForm id={resume.id} initialName={resume.name} />
        <p className="text-xs uppercase tracking-[0.18em] text-brand-700">
          {resume.template}
        </p>
        <p className="text-xs text-slate-500">
          Updated {formatter.format(new Date(resume.updatedAt))}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <LinkButton href={`/builder/${resume.id}`} size="sm">Edit</LinkButton>
        <LinkButton href={`/resume/${resume.id}`} size="sm" variant="secondary">Preview</LinkButton>
        <div className="ml-auto">
          <DeleteResumeButton id={resume.id} />
        </div>
      </div>
    </Card>
  );
}
