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

export const resumeTemplateSchema = z.enum(
  RESUME_TEMPLATE_IDS as [string, ...string[]],
);

export const resumeNameSchema = z
  .string()
  .min(1, 'Resume name is required.')
  .max(80, 'Resume name is too long.');

export const createResumeInputSchema = z.object({
  name: resumeNameSchema.optional(),
  template: resumeTemplateSchema.optional(),
});

export const updateResumeInputSchema = z.object({
  id: z.string().min(1),
  data: resumeDraftSchema,
  template: resumeTemplateSchema.optional(),
});

export const renameResumeInputSchema = z.object({
  id: z.string().min(1),
  name: resumeNameSchema,
});

export const deleteResumeInputSchema = z.object({
  id: z.string().min(1),
});
