import type { ResumeDraft } from '@/lib/types/resume';
import { Card } from '@/components/ui/card';
import { TemplateHeading } from '../_shared/template-heading';

export function ModernSidebarWeb({ draft }: { draft: ResumeDraft }) {
  const allSkills = [
    ...draft.skills.frontend,
    ...draft.skills.backend,
    ...draft.skills.database,
    ...draft.skills.soft,
  ];
  const interests = [...draft.extras.interests, ...draft.extras.hobbies];

  return (
    <Card className="resume-paper grid gap-0 overflow-hidden p-0 lg:grid-cols-[0.36fr_0.64fr]">
      <aside className="bg-brand-900 p-6 text-white sm:p-8">
        <h1 className="text-3xl font-semibold leading-tight">{draft.basics.fullName}</h1>
        <p className="mt-1 text-sm text-brand-100">{draft.basics.professionalTitle}</p>

        <div className="mt-6 space-y-1 text-xs text-brand-100">
          {draft.basics.email ? <p>{draft.basics.email}</p> : null}
          {draft.basics.phone ? <p>{draft.basics.phone}</p> : null}
          {draft.basics.location ? <p>{draft.basics.location}</p> : null}
          {draft.basics.website ? <p className="break-all">{draft.basics.website}</p> : null}
          {draft.basics.github ? <p className="break-all">{draft.basics.github}</p> : null}
          {draft.basics.linkedin ? <p className="break-all">{draft.basics.linkedin}</p> : null}
        </div>

        {allSkills.length > 0 ? (
          <>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
              Skills
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {allSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </>
        ) : null}

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
          Education
        </h2>
        <div className="mt-2 space-y-2">
          {draft.education.map((item) => (
            <div key={`${item.institution}-${item.year}`} className="text-xs">
              <p className="font-medium">{item.degree}</p>
              <p className="text-brand-100">{item.institution}</p>
              <p className="text-brand-200">{item.year}</p>
            </div>
          ))}
        </div>

        {interests.length > 0 ? (
          <>
            <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
              Interests
            </h2>
            <p className="mt-2 text-xs leading-6 text-brand-100">{interests.join(' · ')}</p>
          </>
        ) : null}
      </aside>

      <main className="space-y-6 p-6 sm:p-8">
        <Section title="Summary">
          <p className="text-sm leading-7 text-slate-700">{draft.basics.summary}</p>
        </Section>

        <Section title="Experience">
          <div className="space-y-4">
            {draft.experience.map((item) => (
              <div key={`${item.company}-${item.role}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-ink">
                    {item.role} · {item.company}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {item.start} - {item.current ? 'Present' : item.end}
                  </p>
                </div>
                <p className="mt-1 text-sm leading-7 text-slate-700">{item.summary}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <div className="space-y-4">
            {draft.projects.map((project) => (
              <div key={project.title}>
                <p className="font-medium text-ink">{project.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-700">{project.description}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-brand-700">
                  {project.technologies.join(' · ')}
                </p>
                <p className="text-sm text-slate-500">{project.link}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <TemplateHeading>{title}</TemplateHeading>
      <div className="mt-2">{children}</div>
    </section>
  );
}
