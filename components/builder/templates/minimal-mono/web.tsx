import type { ResumeDraft } from '@/lib/types/resume';
import { Card } from '@/components/ui/card';
import { TemplateHeading } from '../_shared/template-heading';

export function MinimalMonoWeb({ draft }: { draft: ResumeDraft }) {
  const allSkills = [
    ...draft.skills.frontend,
    ...draft.skills.backend,
    ...draft.skills.database,
    ...draft.skills.soft,
  ];

  return (
    <Card className="resume-paper p-6 font-serif text-slate-800 sm:p-10">
      <header className="border-b border-slate-300 pb-6">
        <h1 className="text-4xl font-medium tracking-tight">{draft.basics.fullName}</h1>
        <p className="mt-1 text-base italic text-slate-600">{draft.basics.professionalTitle}</p>
        <p className="mt-3 text-sm text-slate-600">
          {[draft.basics.email, draft.basics.phone, draft.basics.location].filter(Boolean).join('  ·  ')}
        </p>
        <p className="text-sm text-slate-500">
          {[draft.basics.website, draft.basics.github, draft.basics.linkedin].filter(Boolean).join('  ·  ')}
        </p>
      </header>

      <Section title="Summary">
        <p className="text-sm leading-7">{draft.basics.summary}</p>
      </Section>

      <Section title="Skills">
        <p className="text-sm leading-7">{allSkills.join('  ·  ')}</p>
      </Section>

      <Section title="Experience">
        <div className="space-y-4">
          {draft.experience.map((item) => (
            <div key={`${item.company}-${item.role}`}>
              <p className="font-medium">
                {item.role} — {item.company}
              </p>
              <p className="text-xs italic text-slate-500">
                {item.start} – {item.current ? 'Present' : item.end}
              </p>
              <p className="mt-1 text-sm leading-7">{item.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <div className="space-y-4">
          {draft.projects.map((project) => (
            <div key={project.title}>
              <p className="font-medium">{project.title}</p>
              <p className="mt-1 text-sm leading-7">{project.description}</p>
              <p className="mt-1 text-xs italic text-slate-500">
                {project.technologies.join(', ')} · {project.link}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <div className="space-y-1">
          {draft.education.map((item) => (
            <p key={`${item.institution}-${item.year}`} className="text-sm leading-7">
              <span className="font-medium">{item.degree}</span>, {item.institution} · {item.year}
            </p>
          ))}
        </div>
      </Section>

      {draft.extras.interests.length + draft.extras.hobbies.length > 0 ? (
        <Section title="Interests">
          <p className="text-sm leading-7">
            {[...draft.extras.interests, ...draft.extras.hobbies].join('  ·  ')}
          </p>
        </Section>
      ) : null}
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <TemplateHeading tone="muted">{title}</TemplateHeading>
      <div className="mt-2">{children}</div>
    </section>
  );
}
