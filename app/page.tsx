import { ArrowRight, CheckCircle2, FileDown, LayoutTemplate, PencilRuler } from 'lucide-react';
import { LinkButton } from '@/components/ui/link-button';

const points = [
  'Single Next.js codebase with App Router and TypeScript',
  'Multi-step form with local draft persistence',
  'Typed server action scaffold for future DB integration',
  'Readable PDF export and review flow',
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <section className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-brand-200 bg-white/80 px-4 py-1 text-sm font-medium text-brand-800 shadow-sm">
            Resume builder, rebuilt properly
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Build the resume, review it, and export a clean PDF from one unified Next.js project.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              This keeps the spirit of your original Firebase-based flow — landing page, account step, multi-step builder, chip-style lists, and export — but removes the broken split architecture and makes it product-grade.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-panel">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-700" />
                <span className="text-sm text-slate-700">{point}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <LinkButton href="/auth/signup">
              Get started <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/auth/login" variant="ghost">
              I already have an account <FileDown className="h-4 w-4" />
            </LinkButton>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <FeatureCard icon={<PencilRuler className="h-5 w-5" />} title="Builder-first UI" description="Teal + slate direction kept from your original app, but cleaner and more deliberate." />
            <FeatureCard icon={<LayoutTemplate className="h-5 w-5" />} title="Template-ready shape" description="Data model already supports multiple resume templates later without rewriting the form." />
            <FeatureCard icon={<FileDown className="h-5 w-5" />} title="PDF export now" description="Users can fill the builder, review everything, and download a resume immediately." />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
      <div className="mb-3 inline-flex rounded-2xl bg-brand-100 p-2 text-brand-800">{icon}</div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
