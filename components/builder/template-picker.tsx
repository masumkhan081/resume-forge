'use client';

import { templateOptions } from '@/lib/templates/registry';
import type { ResumeTemplateId } from '@/lib/types/resume';
import { cn } from '@/lib/utils';

export function TemplatePicker({
  value,
  onChange,
}: {
  value: ResumeTemplateId;
  onChange: (next: ResumeTemplateId) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {templateOptions.map((template) => {
        const active = value === template.id;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            aria-pressed={active}
            className={cn(
              'flex flex-col gap-2 rounded-2xl border p-3 text-left transition',
              active
                ? 'border-brand-300 bg-brand-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            <span className={cn('h-2 w-12 rounded-full', template.accent)} />
            <span className="text-sm font-semibold text-ink">{template.name}</span>
            <span className="text-xs leading-5 text-slate-600">{template.description}</span>
          </button>
        );
      })}
    </div>
  );
}
