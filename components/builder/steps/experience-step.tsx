'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { RhfField } from '@/components/ui/rhf-field';
import { SectionLabel } from '@/components/ui/section-label';
import { ArrayCard, AddItemButton } from './array-card';
import { SortableItem, SortableList } from '../sortable-list';
import type { ResumeDraft } from '@/lib/types/resume';

export function ExperienceStep() {
  const { register, control } = useFormContext<ResumeDraft>();
  const education = useFieldArray({ control, name: 'education' });
  const experience = useFieldArray({ control, name: 'experience' });

  return (
    <div className="space-y-6">
      <SectionLabel
        title="Education"
        instruction="Most recent first — drag to reorder"
        count={education.fields.length}
      />
      <SortableList
        ids={education.fields.map((field) => field.id)}
        onReorder={(from, to) => education.move(from, to)}
      >
        <div className="space-y-4">
          {education.fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              {({ handle }) => (
                <ArrayCard
                  onRemove={() => education.remove(index)}
                  dragHandle={handle}
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <RhfField name={`education.${index}.institution`} label="Institution" />
                    <RhfField name={`education.${index}.degree`} label="Degree" />
                    <RhfField name={`education.${index}.year`} label="Year" />
                  </div>
                </ArrayCard>
              )}
            </SortableItem>
          ))}
        </div>
      </SortableList>
      <AddItemButton onClick={() => education.append({ institution: '', degree: '', year: '' })}>
        Add education
      </AddItemButton>

      <SectionLabel
        title="Experience"
        instruction="Roles you'd like to highlight — drag to reorder"
        count={experience.fields.length}
      />
      <SortableList
        ids={experience.fields.map((field) => field.id)}
        onReorder={(from, to) => experience.move(from, to)}
      >
        <div className="space-y-4">
          {experience.fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              {({ handle }) => (
                <ArrayCard
                  onRemove={() => experience.remove(index)}
                  dragHandle={handle}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <RhfField name={`experience.${index}.company`} label="Company" />
                    <RhfField name={`experience.${index}.role`} label="Role" />
                    <RhfField name={`experience.${index}.start`} label="Start" />
                    <RhfField name={`experience.${index}.end`} label="End" />
                    <label className="flex items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        {...register(`experience.${index}.current`)}
                      />
                      Currently working here
                    </label>
                    <div className="sm:col-span-2">
                      <RhfField
                        name={`experience.${index}.summary`}
                        label="Summary"
                        textarea
                      />
                    </div>
                  </div>
                </ArrayCard>
              )}
            </SortableItem>
          ))}
        </div>
      </SortableList>
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
