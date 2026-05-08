import type { ResumeDraft, ResumeTemplateId } from '@/lib/types/resume';
import { ClassicTealWeb } from './templates/classic-teal/web';
import { MinimalMonoWeb } from './templates/minimal-mono/web';
import { ModernSidebarWeb } from './templates/modern-sidebar/web';

export function TemplateRenderer({
  template,
  draft,
}: {
  template: ResumeTemplateId;
  draft: ResumeDraft;
}) {
  switch (template) {
    case 'minimal-mono':
      return <MinimalMonoWeb draft={draft} />;
    case 'modern-sidebar':
      return <ModernSidebarWeb draft={draft} />;
    case 'classic-teal':
    default:
      return <ClassicTealWeb draft={draft} />;
  }
}
