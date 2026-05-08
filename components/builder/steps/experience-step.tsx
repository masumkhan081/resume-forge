'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { SectionLabel } from '@/components/ui/section-label';
import { ArrayCard, AddItemButton } from './array-card';
import type { ResumeDraft } from '@/lib/types/resume';

export function ExperienceStep() {
  const { register, control } = useFormContext<ResumeDraft>();
  const education = useFieldArray({ control, name: 'education' });
  const experience = useFieldArray({ control, name: 'experience' });

  return (
    <div className="space-y-6">
      <SectionLabel title="Education" instruction="Most recent first" count={education.fields.length} />
      {education.fields.map((field, index) => (
        <ArrayCard key={field.id} onRemove={() => education.remove(index)}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Institution" {...register(`education.${index}.institution`)} />
            <Field label="Degree" {...register(`education.${index}.degree`)} />
            <Field label="Year" {...register(`education.${index}.year`)} />
          </div>
        </ArrayCard>
      ))}
      <AddItemButton onClick={() => education.append({ institution: '', degree: '', year: '' })}>
        Add education
      </AddItemButton>

      <SectionLabel title="Experience" instruction="Roles you'd like to highlight" count={experience.fields.length} />
      {experience.fields.map((field, index) => (
        <ArrayCard key={field.id} onRemove={() => experience.remove(index)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" {...register(`experience.${index}.company`)} />
            <Field label="Role" {...register(`experience.${index}.role`)} />
            <Field label="Start" {...register(`experience.${index}.start`)} />
            <Field label="End" {...register(`experience.${index}.end`)} />
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" {...register(`experience.${index}.current`)} />
              Currently working here
            </label>
            <div className="sm:col-span-2">
              <Field label="Summary" textarea {...register(`experience.${index}.summary`)} />
            </div>
          </div>
        </ArrayCard>
      ))}
      <AddItemButton
        onClick={() =>
          experience.append({
            company: '',
            role: '',
            start: '',
            end: '',
            current: false,
            summary: '',
          })
        }
      >
        Add experience
      </AddItemButton>
    </div>
  );
}
