import {
  basicsSchema,
  educationItemSchema,
  experienceItemSchema,
  projectItemSchema,
} from '@/lib/schemas/resume';
import type { ResumeDraft } from '@/lib/types/resume';

export const STEPS = ['basics', 'skills', 'experience', 'projects', 'review'] as const;
export type StepKey = (typeof STEPS)[number];

export type SectionStatus = 'complete' | 'incomplete';

export const STEP_LABELS: Record<StepKey, string> = {
  basics: 'Basics',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  review: 'Review',
};

export function isValidStep(value: string | null): value is StepKey {
  return value !== null && (STEPS as readonly string[]).includes(value);
}

function totalSkills(skills: ResumeDraft['skills']): number {
  return (
    skills.frontend.length +
    skills.backend.length +
    skills.database.length +
    skills.soft.length
  );
}

export function computeSectionStatus(
  draft: ResumeDraft,
): Record<StepKey, SectionStatus> {
  const basicsValid = basicsSchema.safeParse(draft.basics).success;

  const skillsValid = totalSkills(draft.skills) > 0;

  const educationValid =
    draft.education.length > 0 &&
    draft.education.every((entry) => educationItemSchema.safeParse(entry).success);
  const experiencesValid = draft.experience.every(
    (entry) => experienceItemSchema.safeParse(entry).success,
  );
  const experienceStepValid = educationValid && experiencesValid;

  const projectsValid =
    draft.projects.length > 0 &&
    draft.projects.every((entry) => projectItemSchema.safeParse(entry).success);

  const reviewValid =
    basicsValid && skillsValid && experienceStepValid && projectsValid;

  return {
    basics: basicsValid ? 'complete' : 'incomplete',
    skills: skillsValid ? 'complete' : 'incomplete',
    experience: experienceStepValid ? 'complete' : 'incomplete',
    projects: projectsValid ? 'complete' : 'incomplete',
    review: reviewValid ? 'complete' : 'incomplete',
  };
}

export function completedCount(
  status: Record<StepKey, SectionStatus>,
): number {
  return STEPS.filter((step) => status[step] === 'complete').length;
}
