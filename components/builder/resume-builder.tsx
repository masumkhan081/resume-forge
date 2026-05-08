'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { BuilderHeader } from './builder-header';
import { StepNavigation } from './step-navigation';
import { LiveStructurePreview } from './live-structure-preview';
import { BasicsStep } from './steps/basics-step';
import { SkillsStep } from './steps/skills-step';
import { ExperienceStep } from './steps/experience-step';
import { ProjectsStep } from './steps/projects-step';
import { ReviewStep } from './steps/review-step';
import { updateResumeAction } from '@/lib/actions/resume-actions';
import type {
  ResumeDraft,
  ResumeRecord,
  ResumeTemplateId,
} from '@/lib/types/resume';

const steps = ['basics', 'skills', 'experience', 'projects', 'review'] as const;
type StepKey = (typeof steps)[number];

export function ResumeBuilder({ resume }: { resume: ResumeRecord }) {
  const router = useRouter();
  const form = useForm<ResumeDraft>({ defaultValues: resume.data, mode: 'onBlur' });
  const [step, setStep] = useState<StepKey>('basics');
  const [template, setTemplate] = useState<ResumeTemplateId>(resume.template);
  const [serverInfo, setServerInfo] = useState('');
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  async function persist() {
    setSaving(true);
    setServerInfo('');
    setServerError('');
    const result = await updateResumeAction({
      id: resume.id,
      data: form.getValues(),
      template,
    });
    if (result.ok) {
      setServerInfo(result.message ?? 'Saved.');
      router.refresh();
    } else {
      setServerError(result.error.message);
    }
    setSaving(false);
  }

  return (
    <FormProvider {...form}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <BuilderHeader name={resume.name} step={step} progress={progress} />

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
                saving={saving}
                onSave={persist}
                serverInfo={serverInfo}
                serverError={serverError}
              />
            )}
          </Card>

          <StepNavigation
            canGoBack={stepIndex > 0}
            canGoNext={stepIndex < steps.length - 1}
            onBack={() => setStep(steps[stepIndex - 1])}
            onNext={() => setStep(steps[stepIndex + 1])}
          />
        </div>

        <div className="space-y-6">
          <LiveStructurePreview />
        </div>
      </div>
    </FormProvider>
  );
}
