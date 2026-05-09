'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  STEPS,
  STEP_LABELS,
  type SectionStatus,
  type StepKey,
} from './section-status';

export function SectionStepper({
  current,
  status,
  onStep,
}: {
  current: StepKey;
  status: Record<StepKey, SectionStatus>;
  onStep: (step: StepKey) => void;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {STEPS.map((step, index) => {
        const isCurrent = step === current;
        const isComplete = status[step] === 'complete';
        return (
          <li key={step}>
            <button
              type="button"
              onClick={() => onStep(step)}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`${STEP_LABELS[step]} ${isComplete ? '(complete)' : '(incomplete)'}`}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                isCurrent
                  ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
                  : isComplete
                    ? 'border-brand-200 bg-brand-50 text-brand-800 hover:border-brand-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                  isCurrent
                    ? 'bg-white/25 text-white'
                    : isComplete
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-slate-700',
                )}
              >
                {isComplete && !isCurrent ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span>{STEP_LABELS[step]}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
