import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BuilderLoading() {
  return (
    <main
      role="status"
      aria-label="Loading builder"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card className="space-y-4 p-5 sm:p-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-sm" />
            </div>
            <Skeleton className="h-4 w-40" />
          </Card>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>

          <Card className="space-y-4 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-12 w-full rounded-full" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Skeleton className="h-11 w-28" />
            <Skeleton className="h-11 w-28" />
          </div>
        </div>

        <Card className="space-y-3 p-5 sm:p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      </div>
      <span className="sr-only">Loading…</span>
    </main>
  );
}
