import type { ResumeDraft, ResumeTemplateId } from '@/lib/types/resume';
import { ClassicTealPdf } from './templates/classic-teal/pdf';
import { MinimalMonoPdf } from './templates/minimal-mono/pdf';
import { ModernSidebarPdf } from './templates/modern-sidebar/pdf';

export function TemplateDocument({
  template,
  draft,
}: {
  template: ResumeTemplateId;
  draft: ResumeDraft;
}) {
  switch (template) {
    case 'minimal-mono':
      return <MinimalMonoPdf draft={draft} />;
    case 'modern-sidebar':
      return <ModernSidebarPdf draft={draft} />;
    case 'classic-teal':
    default:
      return <ClassicTealPdf draft={draft} />;
  }
}
