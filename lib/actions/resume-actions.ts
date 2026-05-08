'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { failure, success } from '@/lib/types/api';
import { sampleResume, emptyResume } from '@/lib/data/default-resume';
import { authed, authedNoInput, requireResume } from './utils';
import {
  createResumeInputSchema,
  deleteResumeInputSchema,
  renameResumeInputSchema,
  updateResumeInputSchema,
} from '@/lib/schemas/resume';
import type {
  ResumeDraft,
  ResumeRecord,
  ResumeSummary,
  ResumeTemplateId,
} from '@/lib/types/resume';

const DEFAULT_PAGE_SIZE = 20;

function toRecord(row: {
  id: string;
  name: string;
  template: string;
  data: string;
  updatedAt: Date;
  createdAt: Date;
}): ResumeRecord {
  return {
    id: row.id,
    name: row.name,
    template: row.template as ResumeTemplateId,
    data: JSON.parse(row.data) as ResumeDraft,
    updatedAt: row.updatedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

function toSummary(row: {
  id: string;
  name: string;
  template: string;
  updatedAt: Date;
}): ResumeSummary {
  return {
    id: row.id,
    name: row.name,
    template: row.template as ResumeTemplateId,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listResumesAction(input?: { page?: number; pageSize?: number }) {
  return authedNoInput(async (session) => {
    const page = Math.max(1, input?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input?.pageSize ?? DEFAULT_PAGE_SIZE));

    const [rows, total] = await Promise.all([
      prisma.resume.findMany({
        where: { userId: session.userId },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, name: true, template: true, updatedAt: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.resume.count({ where: { userId: session.userId } }),
    ]);

    return success({
      items: rows.map(toSummary),
      page,
      pageSize,
      total,
      hasMore: page * pageSize < total,
    });
  });
}

export async function getResumeAction(id: string) {
  return authedNoInput(async (session) => {
    const row = await requireResume(id, session.userId);
    if (!row) return failure('NOT_FOUND', 'Resume not found.');
    return success(toRecord(row));
  });
}

export async function createResumeAction(input: {
  name?: string;
  template?: ResumeTemplateId;
  data?: ResumeDraft;
}) {
  return authed(createResumeInputSchema, input, async (data, session) => {
    const seed = input.data ?? emptyResume();
    const row = await prisma.resume.create({
      data: {
        userId: session.userId,
        name: data.name?.trim() || 'Untitled resume',
        template: data.template ?? 'classic-teal',
        data: JSON.stringify(seed),
      },
    });
    revalidatePath('/dashboard');
    return success({ id: row.id }, 'Resume created.');
  });
}

export async function updateResumeAction(input: {
  id: string;
  data: ResumeDraft;
  template?: ResumeTemplateId;
}) {
  return authed(updateResumeInputSchema, input, async (data, session) => {
    const existing = await requireResume(data.id, session.userId);
    if (!existing) return failure('NOT_FOUND', 'Resume not found.');

    const row = await prisma.resume.update({
      where: { id: data.id },
      data: {
        data: JSON.stringify(data.data),
        template: data.template ?? existing.template,
      },
    });

    revalidatePath(`/builder/${row.id}`);
    revalidatePath(`/resume/${row.id}`);
    revalidatePath('/dashboard');

    return success(
      { id: row.id, updatedAt: row.updatedAt.toISOString() },
      'Resume saved.',
    );
  });
}

export async function renameResumeAction(input: { id: string; name: string }) {
  return authed(renameResumeInputSchema, input, async (data, session) => {
    const existing = await requireResume(data.id, session.userId);
    if (!existing) return failure('NOT_FOUND', 'Resume not found.');

    await prisma.resume.update({
      where: { id: data.id },
      data: { name: data.name.trim() },
    });

    revalidatePath('/dashboard');
    return success({ id: data.id }, 'Renamed.');
  });
}

export async function deleteResumeAction(input: { id: string }) {
  return authed(deleteResumeInputSchema, input, async (data, session) => {
    const existing = await requireResume(data.id, session.userId);
    if (!existing) return failure('NOT_FOUND', 'Resume not found.');

    await prisma.resume.delete({ where: { id: data.id } });
    revalidatePath('/dashboard');

    return success({ id: data.id }, 'Resume deleted.');
  });
}

export async function importLocalDraftAction(input: { data: ResumeDraft }) {
  return authedNoInput(async (session) => {
    if (!input.data || typeof input.data !== 'object') {
      return failure('INVALID_DRAFT', 'That local draft could not be imported.');
    }

    const row = await prisma.resume.create({
      data: {
        userId: session.userId,
        name: 'Imported draft',
        template: 'classic-teal',
        data: JSON.stringify(input.data),
      },
    });

    revalidatePath('/dashboard');
    return success({ id: row.id }, 'Local draft imported.');
  });
}

export async function ensureSeedResume(userId: string) {
  const count = await prisma.resume.count({ where: { userId } });
  if (count > 0) return;
  await prisma.resume.create({
    data: {
      userId,
      name: 'Sample resume',
      template: 'classic-teal',
      data: JSON.stringify(sampleResume),
    },
  });
}
