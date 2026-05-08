'use client';

import { useFormContext } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import type { ResumeDraft } from '@/lib/types/resume';

export function BasicsStep() {
  const { register } = useFormContext<ResumeDraft>();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" {...register('basics.fullName')} />
      <Field label="Professional title" {...register('basics.professionalTitle')} />
      <Field label="Email" type="email" {...register('basics.email')} />
      <Field label="Phone" {...register('basics.phone')} />
      <Field label="Location" {...register('basics.location')} />
      <Field label="Website / portfolio" {...register('basics.website')} />
      <Field label="GitHub" {...register('basics.github')} />
      <Field label="LinkedIn" {...register('basics.linkedin')} />
      <div className="sm:col-span-2">
        <Field label="Professional summary" textarea {...register('basics.summary')} />
      </div>
    </div>
  );
}
