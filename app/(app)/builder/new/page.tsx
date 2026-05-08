import { redirect } from 'next/navigation';
import { createResumeAction } from '@/lib/actions/resume-actions';

export default async function NewBuilderPage() {
  const result = await createResumeAction({});
  if (!result.ok) {
    redirect(
      `/dashboard?error=${encodeURIComponent(result.error.message)}`,
    );
  }
  redirect(`/builder/${result.data.id}`);
}
