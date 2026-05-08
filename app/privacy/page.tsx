import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How Resume Forge handles your data.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Card className="space-y-5 p-6 sm:p-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            Privacy
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            Privacy policy
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Last updated {new Date().toISOString().slice(0, 10)}.
          </p>
        </header>

        <Section title="What we collect">
          We collect the email and display name you provide at signup, and the
          resume content you save. Passwords are stored only as bcrypt hashes.
        </Section>

        <Section title="What we do not collect">
          We do not run third-party analytics or advertising trackers. We do not
          sell or share data with marketing partners.
        </Section>

        <Section title="How we store data">
          Your account and resumes are persisted in our application database.
          Sessions are stored as opaque tokens with a 30-day expiry and can be
          revoked from the profile page.
        </Section>

        <Section title="Your rights">
          You can rename, edit, or delete any resume from the dashboard. Account
          deletion (Profile → Danger zone) removes your user record and all
          associated resumes immediately and irreversibly.
        </Section>

        <Section title="Contact">
          For privacy questions, email the operator listed at the bottom of the
          repository&apos;s README.
        </Section>

        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          This is a placeholder policy intended to outline the structure. Real
          deployments need policy text reviewed by counsel before going live.
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
