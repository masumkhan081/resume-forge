'use client';

import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { ChipInput } from './chip-input';

export function ChipField<TForm extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  limit,
}: {
  name: FieldPath<TForm>;
  control: Control<TForm>;
  label: string;
  placeholder: string;
  limit?: number;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ChipInput
          label={label}
          placeholder={placeholder}
          values={(field.value as string[] | undefined) ?? []}
          onChange={field.onChange}
          limit={limit}
        />
      )}
    />
  );
}
