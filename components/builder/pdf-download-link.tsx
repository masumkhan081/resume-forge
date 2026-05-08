'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import type { ResumeDraft, ResumeTemplateId } from '@/lib/types/resume';
import { TemplateDocument } from './template-document';

export function PdfDownloadLink({
  draft,
  template = 'classic-teal',
}: {
  draft: ResumeDraft;
  template?: ResumeTemplateId;
}) {
  return (
    <PDFDownloadLink
      document={<TemplateDocument template={template} draft={draft} />}
      fileName={`${draft.basics.fullName || 'resume'}.pdf`}
      className="inline-flex items-center justify-center rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
    >
      {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
    </PDFDownloadLink>
  );
}
