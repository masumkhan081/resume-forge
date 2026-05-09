'use client';

import { useRouter } from 'next/navigation';
import { updateProfileNameAction } from '@/lib/actions/account-actions';
import { updateNameSchema } from '@/lib/schemas/account';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { Field } from '@/components/ui/field';
import { FormFeedback } from '@/components/ui/form-feedback';
import { SubmitButton } from '@/components/ui/submit-button';

export function ProfileNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const form = useZodForm({
    schema: updateNameSchema,
    action: updateProfileNameAction,
    onSuccess: () => router.refresh(),
  });

  return (
    <form action={form.handleFormAction} className="space-y-4">
      <Field name="name" label="Display name" defaultValue={initialName} placeholder="Your name" required />
      <FormFeedback error={form.error} success={form.info} />
      <SubmitButton pending={form.pending} pendingLabel="Saving...">
        Save name
      </SubmitButton>
    </form>
  );
}
