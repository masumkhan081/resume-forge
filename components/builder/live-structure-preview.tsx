'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { WandSparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ResumeDraft } from '@/lib/types/resume';

export function LiveStructurePreview() {
  const { control } = useFormContext<ResumeDraft>();
  const skills = useWatch({ control, name: 'skills' });
  const projects = useWatch({ control, name: 'projects' });

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-2xl bg-brand-100 p-2 text-brand-800">
          <WandSparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-ink">Live structure preview</h2>
          <p className="text-sm text-slate-500">Useful while shaping the content step by step.</p>
        </div>
      </div>
      <div className="space-y-4 text-sm text-slate-700">
        <QuickList title="Front-end" values={skills?.frontend ?? []} />
        <QuickList title="Back-end" values={skills?.backend ?? []} />
        <QuickList title="Database" values={skills?.database ?? []} />
        <QuickList title="Projects" values={(projects ?? []).map((item) => item.title)} />
      </div>
    </Card>
  );
}

function QuickList({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="mb-2 font-medium text-ink">{title}</p>
      <div className="flex flex-wrap gap-2">
        {values.length ? (
          values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs"
            >
              {value || '—'}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">Nothing added yet.</span>
        )}
      </div>
    </div>
  );
}
