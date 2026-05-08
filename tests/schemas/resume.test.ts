import { describe, expect, it } from 'vitest';
import {
  resumeDraftSchema,
  resumeNameSchema,
  createResumeInputSchema,
  updateResumeInputSchema,
} from '@/lib/schemas/resume';
import { sampleResume, emptyResume } from '@/lib/data/default-resume';

describe('resumeDraftSchema', () => {
  it('accepts the seeded sample resume', () => {
    const result = resumeDraftSchema.safeParse(sampleResume);
    expect(result.success).toBe(true);
  });

  it('rejects a missing professional summary', () => {
    const broken = {
      ...sampleResume,
      basics: { ...sampleResume.basics, summary: 'too short' },
    };
    expect(resumeDraftSchema.safeParse(broken).success).toBe(false);
  });

  it('rejects a resume with zero education entries', () => {
    const broken = { ...sampleResume, education: [] };
    expect(resumeDraftSchema.safeParse(broken).success).toBe(false);
  });

  it('rejects a resume with zero projects', () => {
    const broken = { ...sampleResume, projects: [] };
    expect(resumeDraftSchema.safeParse(broken).success).toBe(false);
  });

  it('rejects a project with no technologies', () => {
    const broken = {
      ...sampleResume,
      projects: [{ ...sampleResume.projects[0], technologies: [] }],
    };
    expect(resumeDraftSchema.safeParse(broken).success).toBe(false);
  });

  it('emptyResume returns a structurally complete shape', () => {
    const empty = emptyResume();
    expect(empty.basics.fullName).toBe('');
    expect(Array.isArray(empty.education)).toBe(true);
    expect(Array.isArray(empty.projects)).toBe(true);
  });
});

describe('resumeNameSchema', () => {
  it('rejects an empty name', () => {
    expect(resumeNameSchema.safeParse('').success).toBe(false);
  });

  it('rejects names longer than 80 chars', () => {
    expect(resumeNameSchema.safeParse('a'.repeat(81)).success).toBe(false);
  });
});

describe('createResumeInputSchema', () => {
  it('accepts an empty input', () => {
    expect(createResumeInputSchema.safeParse({}).success).toBe(true);
  });

  it('rejects an invalid template id', () => {
    expect(
      createResumeInputSchema.safeParse({ template: 'not-a-template' }).success,
    ).toBe(false);
  });
});

describe('updateResumeInputSchema', () => {
  it('requires a resume id', () => {
    expect(
      updateResumeInputSchema.safeParse({ id: '', data: sampleResume }).success,
    ).toBe(false);
  });

  it('accepts a valid update payload', () => {
    expect(
      updateResumeInputSchema.safeParse({
        id: 'abc',
        data: sampleResume,
        template: 'minimal-mono',
      }).success,
    ).toBe(true);
  });
});
