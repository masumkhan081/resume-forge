'use client';

import { RhfField } from '@/components/ui/rhf-field';

export function BasicsStep() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RhfField name="basics.fullName" label="Full name" />
      <RhfField name="basics.professionalTitle" label="Professional title" />
      <RhfField name="basics.email" label="Email" type="email" />
      <RhfField name="basics.phone" label="Phone" />
      <RhfField name="basics.location" label="Location" />
      <RhfField name="basics.website" label="Website / portfolio" />
      <RhfField name="basics.github" label="GitHub" />
      <RhfField name="basics.linkedin" label="LinkedIn" />
      <div className="sm:col-span-2">
        <RhfField name="basics.summary" label="Professional summary" textarea />
      </div>
    </div>
  );
}
