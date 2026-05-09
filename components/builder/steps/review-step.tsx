'use client';

import dynamic from 'next/dynamic';
import { useFormContext } from 'react-hook-form';
import { Banner } from '@/components/ui/banner';
import { LinkButton } from '@/components/ui/link-button';
import { SectionLabel } from '@/components/ui/section-label';
import { TemplatePicker } from '../template-picker';
import type { ResumeDraft, ResumeTemplateId } from '@/lib/types/resume';

const PdfDownloadLink = dynamic(
  () => import('../pdf-download-link').then((mod) => mod.PdfDownloadLink),
  { ssr: false },
);

export function ReviewStep({
  resumeId,
  template,
  onTemplateChange,
}: {
  resumeId: string;
  template: ResumeTemplateId;
  onTemplateChange: (next: ResumeTemplateId) => void;
}) {
  const { getValues } = useFormContext<ResumeDraft>();
  const draft = getValues();

  return (
    <div className="space-y-5">
      <SectionLabel
        title="Template"
        instruction="Affects both the live preview and the PDF"
      />
      <TemplatePicker value={template} onChange={onTemplateChange} />

      <Banner variant="info">
        <span className="font-semibold">All changes save automatically.</span> Use the
        section stepper to confirm everything is complete, then export the PDF.
      </Banner>

      <div className="flex flex-wrap gap-3">
        <PdfDownloadLink draft={draft} template={template} />
        <LinkButton href={`/resume/${resumeId}`} variant="secondary">
          Open full preview
        </LinkButton>
      </div>
    </div>
  );
}
