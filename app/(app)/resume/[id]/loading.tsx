import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResumePreviewLoading() {
  return (
    <main
      role="status"
      aria-label="Loading preview"
      className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <Card className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-11 w-20" />
          <Skeleton className="h-11 w-28" />
          <Skeleton className="h-11 w-32" />
        </div>
      </Card>

      <Card className="resume-paper space-y-4 p-6 sm:p-8">
        <Skeleton className="h-9 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid gap-6 pt-4 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="mt-4 h-3 w-24" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-4 h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </Card>
      <span className="sr-only">Loading…</span>
    </main>
  );
}
