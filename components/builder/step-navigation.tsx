'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StepNavigation({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
}: {
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="bg-white text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button type="button" onClick={onNext} disabled={!canGoNext}>
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
