'use client';

import { useRouter } from 'next/navigation';
import { updateProfileNameAction } from '@/lib/actions/account-actions';
import { updateNameSchema } from '@/lib/schemas/account';
import { useZodForm } from '@/lib/hooks/use-zod-form';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/ui/banner';

export function ProfileNameForm({ initialName }: { initialName: string }) {
  const router = useRouter();
  const form = useZodForm({
    schema: updateNameSchema,
    action: updateProfileNameAction,
    onSuccess: () => router.refresh(),
  });

  return (
    <form action={form.handleFormAction} className="space-y-4">
      <Field name="fullName" label="Display name" defaultValue={initialName} placeholder="Your name" required />
      {form.error ? <Banner variant="error">{form.error}</Banner> : null}
      {form.info ? <Banner variant="success">{form.info}</Banner> : null}
      <Button type="submit" disabled={form.pending}>
        {form.pending ? 'Saving...' : 'Save name'}
      </Button>
    </form>
  );
}
