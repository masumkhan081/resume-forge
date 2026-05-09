import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <main
      role="status"
      aria-label="Loading dashboard"
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-11 w-36" />
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex flex-col justify-between gap-4 p-5">
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-14" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="ml-auto h-7 w-16" />
            </div>
          </Card>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </main>
  );
}
