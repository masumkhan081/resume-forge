'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { ChipField } from '@/components/ui/chip-field';
import { SectionLabel } from '@/components/ui/section-label';
import { ArrayCard, AddItemButton } from './array-card';
import type { ResumeDraft } from '@/lib/types/resume';

export function ProjectsStep() {
  const { register, control } = useFormContext<ResumeDraft>();
  const projects = useFieldArray({ control, name: 'projects' });

  return (
    <div className="space-y-6">
      <SectionLabel title="Projects" instruction="The ones you're proud of" count={projects.fields.length} />
      {projects.fields.map((field, index) => (
        <ArrayCard key={field.id} onRemove={() => projects.remove(index)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project title" {...register(`projects.${index}.title`)} />
            <Field label="Project link" {...register(`projects.${index}.link`)} />
            <div className="sm:col-span-2">
              <Field label="Description" textarea {...register(`projects.${index}.description`)} />
            </div>
            <div className="sm:col-span-2">
              <ChipField
                control={control}
                name={`projects.${index}.technologies`}
                label="Technologies"
                placeholder="React, Firebase, Stripe..."
                limit={10}
              />
            </div>
          </div>
        </ArrayCard>
      ))}
      <AddItemButton
        onClick={() => projects.append({ title: '', description: '', link: '', technologies: [] })}
      >
        Add project
      </AddItemButton>

      <SectionLabel title="Interests & hobbies" instruction="Who you are off-screen" />
      <div className="grid gap-5 sm:grid-cols-2">
        <ChipField
          control={control}
          name="extras.interests"
          label="Interests"
          placeholder="AI integration, design systems..."
          limit={10}
        />
        <ChipField
          control={control}
          name="extras.hobbies"
          label="Hobbies"
          placeholder="Trekking, reading, chess..."
          limit={10}
        />
      </div>
    </div>
  );
}
