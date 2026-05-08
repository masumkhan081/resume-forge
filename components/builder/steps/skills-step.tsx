'use client';

import { useFormContext } from 'react-hook-form';
import { ChipField } from '@/components/ui/chip-field';
import type { ResumeDraft } from '@/lib/types/resume';

export function SkillsStep() {
  const { control } = useFormContext<ResumeDraft>();
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <ChipField
        control={control}
        name="skills.frontend"
        label="Front-end skills"
        placeholder="React, Next.js, Tailwind..."
      />
      <ChipField
        control={control}
        name="skills.backend"
        label="Back-end skills"
        placeholder="Node.js, Express, APIs..."
      />
      <ChipField
        control={control}
        name="skills.database"
        label="Database / platform"
        placeholder="MongoDB, Firebase, PostgreSQL..."
      />
      <ChipField
        control={control}
        name="skills.soft"
        label="Soft skills"
        placeholder="Communication, ownership..."
      />
    </div>
  );
}
