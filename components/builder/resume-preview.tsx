import type { ResumeDraft, ResumeTemplateId } from '@/lib/types/resume';
import { TemplateRenderer } from './template-renderer';

export function ResumePreview({
  draft,
  template = 'classic-teal',
}: {
  draft: ResumeDraft;
  template?: ResumeTemplateId;
}) {
  return <TemplateRenderer template={template} draft={draft} />;
}
