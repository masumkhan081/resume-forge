import { z } from 'zod';
import { RESUME_TEMPLATE_IDS } from '@/lib/types/resume';

export const basicsSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  professionalTitle: z.string().min(2, 'Add a professional title.'),
  email: z.string().email('Enter a valid email.'),
  phone: z.string().min(7, 'Phone looks too short.'),
  location: z.string().min(2, 'Add a location.'),
  website: z.string().optional().or(z.literal('')),
  github: z.string().optional().or(z.literal('')),
  linkedin: z.string().optional().or(z.literal('')),
  summary: z
    .string()
    .min(20, 'Summary should be at least 20 characters.')
    .max(400, 'Summary cannot exceed 400 characters.'),
});

export const educationItemSchema = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  year: z.string().min(4),
});

export const experienceItemSchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  start: z.string().min(2),
  end: z.string().min(2),
  current: z.boolean(),
  summary: z.string().min(10),
});

export const projectItemSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  link: z.string().min(2),
  technologies: z.array(z.string().min(1)).min(1),
});

export const skillsSchema = z.object({
  frontend: z.array(z.string()).max(12),
  backend: z.array(z.string()).max(12),
  database: z.array(z.string()).max(12),
  soft: z.array(z.string()).max(12),
});

export const extrasSchema = z.object({
  interests: z.array(z.string()).max(10),
  hobbies: z.array(z.string()).max(10),
});

export const resumeDraftSchema = z.object({
  basics: basicsSchema,
  skills: skillsSchema,
  education: z.array(educationItemSchema).min(1, 'Add at least one education entry.'),
  experience: z.array(experienceItemSchema),
  projects: z.array(projectItemSchema).min(1, 'Add at least one project.'),
  extras: extrasSchema,
});
export type ResumeDraftSchema = z.infer<typeof resumeDraftSchema>;

// Lenient counterpart used by the autosave path: persist whatever the user has
// typed without blocking on min/length rules. Strict validation still runs
// client-side via zodResolver(resumeDraftSchema) and surfaces per-field errors.
const draftBasicsSchema = z.object({
  fullName: z.string(),
  professionalTitle: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  github: z.string(),
  linkedin: z.string(),
  summary: z.string(),
});

const draftEducationItemSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  year: z.string(),
});

const draftExperienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  start: z.string(),
  end: z.string(),
  current: z.boolean(),
  summary: z.string(),
});

const draftProjectItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string(),
  technologies: z.array(z.string()),
});

export const draftResumeSchema = z.object({
  basics: draftBasicsSchema,
  skills: skillsSchema,
  education: z.array(draftEducationItemSchema),
  experience: z.array(draftExperienceItemSchema),
  projects: z.array(draftProjectItemSchema),
  extras: extrasSchema,
});

export const resumeTemplateSchema = z.enum(RESUME_TEMPLATE_IDS);

export const resumeNameSchema = z
  .string()
  .min(1, 'Resume name is required.')
  .max(80, 'Resume name is too long.');

export const createResumeInputSchema = z.object({
  name: resumeNameSchema.optional(),
  template: resumeTemplateSchema.optional(),
});

export const autosaveResumeInputSchema = z.object({
  id: z.string().min(1),
  data: draftResumeSchema,
  template: resumeTemplateSchema.optional(),
});

export const renameResumeInputSchema = z.object({
  id: z.string().min(1),
  name: resumeNameSchema,
});

export const deleteResumeInputSchema = z.object({
  id: z.string().min(1),
});
