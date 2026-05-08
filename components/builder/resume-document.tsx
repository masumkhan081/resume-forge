import type { ResumeDraft, ResumeTemplateId } from '@/lib/types/resume';
import { TemplateDocument } from './template-document';

export function ResumeDocument({
  draft,
  template = 'classic-teal',
}: {
  draft: ResumeDraft;
  template?: ResumeTemplateId;
}) {
  return <TemplateDocument template={template} draft={draft} />;
}
