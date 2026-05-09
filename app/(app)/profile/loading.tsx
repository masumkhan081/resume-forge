import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <main
      role="status"
      aria-label="Loading profile"
      className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
    >
      <Card className="p-5 sm:p-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
      </Card>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="space-y-4 p-5 sm:p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full max-w-sm" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-11 w-32" />
        </Card>
      ))}
      <span className="sr-only">Loading…</span>
    </main>
  );
}
