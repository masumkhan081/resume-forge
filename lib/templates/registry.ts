import type { ResumeTemplateId } from '@/lib/types/resume';

export type TemplateMeta = {
  id: ResumeTemplateId;
  name: string;
  description: string;
  accent: string;
};

export const templateMeta: Record<ResumeTemplateId, TemplateMeta> = {
  'classic-teal': {
    id: 'classic-teal',
    name: 'Classic teal',
    description: 'Two-column layout with teal accents and chip-style skills.',
    accent: 'bg-brand-700',
  },
  'minimal-mono': {
    id: 'minimal-mono',
    name: 'Minimal mono',
    description: 'Single column, serif type, neutral and distraction-free.',
    accent: 'bg-slate-900',
  },
  'modern-sidebar': {
    id: 'modern-sidebar',
    name: 'Modern sidebar',
    description: 'Dark sidebar carries contact + skills, lighter main column.',
    accent: 'bg-brand-900',
  },
};

export const templateOptions = Object.values(templateMeta);
