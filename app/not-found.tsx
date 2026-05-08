import { Card } from '@/components/ui/card';
import { LinkButton } from '@/components/ui/link-button';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full space-y-4 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          404
        </p>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
          That page is not on the resume.
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          The link is broken or the page has moved. Head back to the builder or
          start over from the home page.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <LinkButton href="/">Go home</LinkButton>
          <LinkButton href="/dashboard" variant="secondary">Go to dashboard</LinkButton>
        </div>
      </Card>
    </main>
  );
}
