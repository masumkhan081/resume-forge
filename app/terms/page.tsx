import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of using Resume Forge.',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Card className="space-y-5 p-6 sm:p-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Terms
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            Terms of service
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Last updated {new Date().toISOString().slice(0, 10)}.
          </p>
        </header>

        <Section title="Acceptable use">
          Use Resume Forge to author your own resume content. Do not upload
          content that violates someone else&apos;s rights, contains malware,
          or is unlawful. Automated abuse, credential stuffing, or scraping is
          prohibited.
        </Section>

        <Section title="Accounts">
          You are responsible for the credentials you choose. We hash passwords
          but cannot recover them; if a real recovery flow is enabled, only the
          email tied to your account will receive reset links.
        </Section>

        <Section title="Service availability">
          The service is provided as-is. We aim for high availability but make
          no uptime or data-durability guarantees beyond standard backups.
        </Section>

        <Section title="Termination">
          You can delete your account at any time from the profile page. We may
          terminate accounts found in violation of these terms.
        </Section>

        <Section title="Liability">
          To the extent permitted by law, the operator&apos;s liability is
          limited to the amount you paid for the service in the past 12 months
          (which, for the free tier, is zero).
        </Section>

        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          This is a placeholder template intended to outline the structure.
          Real deployments need terms reviewed by counsel before going live.
        </p>
      </Card>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
        {title}
      </h2>
      <p className="text-sm leading-7 text-slate-700">{children}</p>
    </section>
  );
}
