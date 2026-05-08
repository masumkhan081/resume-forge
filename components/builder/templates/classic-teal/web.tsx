import type { ResumeDraft } from '@/lib/types/resume';
import { Card } from '@/components/ui/card';
import { TemplateHeading } from '../_shared/template-heading';

export function ClassicTealWeb({ draft }: { draft: ResumeDraft }) {
  return (
    <Card className="resume-paper p-6 sm:p-8">
      <section className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold text-ink">{draft.basics.fullName}</h1>
        <p className="mt-1 text-base text-brand-800">{draft.basics.professionalTitle}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {[draft.basics.email, draft.basics.phone, draft.basics.location].filter(Boolean).join(' · ')}
        </p>
        <p className="text-sm leading-6 text-slate-600">
          {[draft.basics.github, draft.basics.linkedin, draft.basics.website].filter(Boolean).join(' · ')}
        </p>
      </section>

      <section className="grid gap-8 pt-8 lg:grid-cols-[0.38fr_0.62fr]">
        <div className="space-y-8">
          <PreviewSection title="Skills">
            {[...draft.skills.frontend, ...draft.skills.backend, ...draft.skills.database, ...draft.skills.soft].map(
              (skill) => (
                <span
                  key={skill}
                  className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800"
                >
                  {skill}
                </span>
              ),
            )}
          </PreviewSection>

          <PreviewSection title="Education">
            {draft.education.map((item) => (
              <div key={`${item.institution}-${item.year}`}>
                <p className="font-medium text-ink">{item.degree}</p>
                <p className="text-sm text-slate-600">{item.institution}</p>
                <p className="text-sm text-slate-500">{item.year}</p>
              </div>
            ))}
          </PreviewSection>

          <PreviewSection title="Interests & Hobbies">
            {[...draft.extras.interests, ...draft.extras.hobbies].map((item) => (
              <p key={item} className="text-sm text-slate-700">
                • {item}
              </p>
            ))}
          </PreviewSection>
        </div>

        <div className="space-y-8">
          <PreviewSection title="Summary">
            <p className="text-sm leading-7 text-slate-700">{draft.basics.summary}</p>
          </PreviewSection>

          <PreviewSection title="Experience">
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
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.summary}</p>
              </div>
            ))}
          </PreviewSection>

          <PreviewSection title="Projects">
            {draft.projects.map((project) => (
              <div key={project.title}>
                <p className="font-medium text-ink">{project.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-700">{project.description}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-brand-700">
                  {project.technologies.join(' · ')}
                </p>
                <p className="mt-1 text-sm text-slate-500">{project.link}</p>
              </div>
            ))}
          </PreviewSection>
        </div>
      </section>
    </Card>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <TemplateHeading>{title}</TemplateHeading>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
