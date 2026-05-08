'use client';

import dynamic from 'next/dynamic';
import { Save } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
  saving,
  onSave,
  serverInfo,
  serverError,
}: {
  resumeId: string;
  template: ResumeTemplateId;
  onTemplateChange: (next: ResumeTemplateId) => void;
  saving: boolean;
  onSave: () => void;
  serverInfo: string;
  serverError: string;
}) {
  const { getValues } = useFormContext<ResumeDraft>();
  const draft = getValues();

  return (
    <div className="space-y-5">
      <SectionLabel title="Template" instruction="Affects both the live preview and the PDF" />
      <TemplatePicker value={template} onChange={onTemplateChange} />

      <Banner variant="info">
        <span className="font-semibold">Ready to save.</span> Validation runs on the server. The PDF is generated in your browser from the draft and template you have selected.
      </Banner>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={onSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save resume'}
        </Button>
        <PdfDownloadLink draft={draft} template={template} />
        <LinkButton href={`/resume/${resumeId}`} variant="secondary">
          Open full preview
        </LinkButton>
      </div>
      {serverInfo ? <Banner variant="success">{serverInfo}</Banner> : null}
      {serverError ? <Banner variant="error">{serverError}</Banner> : null}
    </div>
  );
}
