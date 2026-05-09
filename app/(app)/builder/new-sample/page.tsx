import { redirect } from 'next/navigation';
import { createResumeAction } from '@/lib/actions/resume-actions';
import { sampleResume } from '@/lib/data/default-resume';

export default async function NewSampleBuilderPage() {
  const result = await createResumeAction({
    name: 'Sample resume',
    data: sampleResume,
  });
  if (!result.ok) {
    redirect(`/dashboard?error=${encodeURIComponent(result.error.message)}`);
  }
  redirect(`/builder/${result.data.id}`);
}
