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
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Preview · {resume.template}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">{resume.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Review the full layout, then export the PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={`/builder/${resume.id}`} variant="secondary">Edit</LinkButton>
          <LinkButton href="/dashboard" variant="secondary">Dashboard</LinkButton>
          <PdfDownloadLink draft={resume.data} template={resume.template} />
        </div>
      </Card>
      <ResumePreview draft={resume.data} template={resume.template} />
    </div>
  );
}
