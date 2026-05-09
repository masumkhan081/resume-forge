'use client';

import dynamic from 'next/dynamic';
import { ResumePreview } from './resume-preview';
import { Card } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';
import type { ResumeRecord } from '@/lib/types/resume';

const PdfDownloadLink = dynamic(
  () => import('./pdf-download-link').then((mod) => mod.PdfDownloadLink),
  { ssr: false },
);

export function ResumePreviewPage({ resume }: { resume: ResumeRecord }) {
  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-start justify-between gap-4 p-5 sm:items-center sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Preview · {resume.template}
          </p>
          <h1
            title={resume.name}
            className="mt-1 truncate text-xl font-semibold text-ink sm:text-2xl"
          >
            {resume.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review the full layout, then export the PDF.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:gap-3">
          <LinkButton
            href={`/builder/${resume.id}`}
            variant="secondary"
            className="flex-1 sm:flex-initial"
          >
            Edit
          </LinkButton>
          <LinkButton
            href="/dashboard"
            variant="secondary"
            className="flex-1 sm:flex-initial"
          >
            Dashboard
          </LinkButton>
          <PdfDownloadLink draft={resume.data} template={resume.template} />
        </div>
      </Card>
      <ResumePreview draft={resume.data} template={resume.template} />
    </div>
  );
}
