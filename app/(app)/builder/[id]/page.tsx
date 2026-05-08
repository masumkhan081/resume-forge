import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResumeBuilder } from '@/components/builder/resume-builder';
import { getResumeAction } from '@/lib/actions/resume-actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getResumeAction(id);
  if (!result.ok) return { title: 'Builder' };
  return { title: `Edit · ${result.data.name}` };
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResumeAction(id);
  if (!result.ok) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ResumeBuilder resume={result.data} />
    </main>
  );
}
