'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { RhfField } from '@/components/ui/rhf-field';
import { ChipField } from '@/components/ui/chip-field';
import { SectionLabel } from '@/components/ui/section-label';
import { ArrayCard, AddItemButton } from './array-card';
import { SortableItem, SortableList } from '../sortable-list';
import type { ResumeDraft } from '@/lib/types/resume';

export function ProjectsStep() {
  const { control } = useFormContext<ResumeDraft>();
  const projects = useFieldArray({ control, name: 'projects' });

  return (
    <div className="space-y-6">
      <SectionLabel
        title="Projects"
        instruction="The ones you're proud of — drag to reorder"
        count={projects.fields.length}
      />
      <SortableList
        ids={projects.fields.map((field) => field.id)}
        onReorder={(from, to) => projects.move(from, to)}
      >
        <div className="space-y-4">
          {projects.fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              {({ handle }) => (
                <ArrayCard
                  onRemove={() => projects.remove(index)}
                  dragHandle={handle}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <RhfField name={`projects.${index}.title`} label="Project title" />
                    <RhfField name={`projects.${index}.link`} label="Project link" />
                    <div className="sm:col-span-2">
                      <RhfField
                        name={`projects.${index}.description`}
                        label="Description"
                        textarea
                      />
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
              )}
            </SortableItem>
          ))}
        </div>
      </SortableList>
      <AddItemButton
        onClick={() =>
          projects.append({ title: '', description: '', link: '', technologies: [] })
        }
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
