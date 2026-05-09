'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { BuilderHeader } from './builder-header';
import { SectionStepper } from './section-stepper';
import { StepNavigation } from './step-navigation';
import { LiveStructurePreview } from './live-structure-preview';
import { BasicsStep } from './steps/basics-step';
import { SkillsStep } from './steps/skills-step';
import { ExperienceStep } from './steps/experience-step';
import { ProjectsStep } from './steps/projects-step';
import { ReviewStep } from './steps/review-step';
import {
  STEPS,
  computeSectionStatus,
  completedCount,
  isValidStep,
  type StepKey,
} from './section-status';
import { autosaveResumeAction } from '@/lib/actions/resume-actions';
import { resumeDraftSchema } from '@/lib/schemas/resume';
import { useAutosave } from '@/lib/hooks/use-autosave';
import type {
  ResumeDraft,
  ResumeRecord,
  ResumeTemplateId,
} from '@/lib/types/resume';

export function ResumeBuilder({ resume }: { resume: ResumeRecord }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stepFromUrl = searchParams.get('step');
  const initialStep: StepKey = isValidStep(stepFromUrl) ? stepFromUrl : 'basics';

  const form = useForm<ResumeDraft>({
    defaultValues: resume.data,
    mode: 'onBlur',
    resolver: zodResolver(resumeDraftSchema),
  });

  const [step, setStepState] = useState<StepKey>(initialStep);
  const [template, setTemplate] = useState<ResumeTemplateId>(resume.template);

  function setStep(next: StepKey) {
    setStepState(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const watchedDraft = useWatch({ control: form.control });
  const sectionStatus = useMemo(
    () => computeSectionStatus((watchedDraft as ResumeDraft) ?? resume.data),
    [watchedDraft, resume.data],
  );
  const completed = completedCount(sectionStatus);

  const stepIndex = STEPS.indexOf(step);

  const autosaveData = useMemo(
    () => ({ data: (watchedDraft as ResumeDraft) ?? resume.data, template }),
    [watchedDraft, template, resume.data],
  );

  const handleSave = useCallback(
    async (snapshot: { data: ResumeDraft; template: ResumeTemplateId }) => {
      const result = await autosaveResumeAction({
        id: resume.id,
        data: snapshot.data,
        template: snapshot.template,
      });
      if (result.ok) {
        return { ok: true as const };
      }
      return { ok: false as const, error: result.error.message };
    },
    [resume.id],
  );

  const autosave = useAutosave({ data: autosaveData, save: handleSave });

  return (
    <FormProvider {...form}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <BuilderHeader
            name={resume.name}
            completedSections={completed}
            totalSections={STEPS.length}
            autosave={{
              status: autosave.status,
              errorMessage: autosave.errorMessage,
              lastSavedAt: autosave.lastSavedAt,
              onRetry: autosave.retry,
            }}
          />

          <SectionStepper current={step} status={sectionStatus} onStep={setStep} />

          <Card className="p-5 sm:p-6">
            {step === 'basics' && <BasicsStep />}
            {step === 'skills' && <SkillsStep />}
            {step === 'experience' && <ExperienceStep />}
            {step === 'projects' && <ProjectsStep />}
            {step === 'review' && (
              <ReviewStep
                resumeId={resume.id}
                template={template}
                onTemplateChange={setTemplate}
              />
            )}
          </Card>

          <StepNavigation
            canGoBack={stepIndex > 0}
            canGoNext={stepIndex < STEPS.length - 1}
            onBack={() => setStep(STEPS[stepIndex - 1])}
            onNext={() => setStep(STEPS[stepIndex + 1])}
          />
        </div>

        <div className="space-y-6">
          <LiveStructurePreview />
        </div>
      </div>
    </FormProvider>
  );
}
