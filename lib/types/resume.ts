export type ResumeSkillGroup = 'frontend' | 'backend' | 'database' | 'soft';

export type EducationItem = {
  institution: string;
  degree: string;
  year: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  start: string;
  end: string;
  current: boolean;
  summary: string;
};

export type ProjectItem = {
  title: string;
  description: string;
  link: string;
  technologies: string[];
};

export type ResumeTemplateId = 'classic-teal' | 'minimal-mono' | 'modern-sidebar';

export const RESUME_TEMPLATE_IDS: ResumeTemplateId[] = [
  'classic-teal',
  'minimal-mono',
  'modern-sidebar',
];

export type ResumeDraft = {
  basics: {
    fullName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    soft: string[];
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  extras: {
    interests: string[];
    hobbies: string[];
  };
};

export type ResumeRecord = {
  id: string;
  name: string;
  template: ResumeTemplateId;
  data: ResumeDraft;
  updatedAt: string;
  createdAt: string;
};

export type ResumeSummary = {
  id: string;
  name: string;
  template: ResumeTemplateId;
  updatedAt: string;
};
