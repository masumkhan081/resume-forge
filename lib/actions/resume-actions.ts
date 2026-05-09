'use server';

import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';
import { connectMongo } from '@/lib/mongodb';
import { Resume, type ResumeDoc } from '@/lib/models/resume';
import { failure, success } from '@/lib/types/api';
import { sampleResume, emptyResume } from '@/lib/data/default-resume';
import { authed, authedNoInput, requireResume } from './utils';
import {
  autosaveResumeInputSchema,
  createResumeInputSchema,
  deleteResumeInputSchema,
  renameResumeInputSchema,
} from '@/lib/schemas/resume';
import type {
  ResumeDraft,
  ResumeRecord,
  ResumeSummary,
  ResumeTemplateId,
} from '@/lib/types/resume';

const DEFAULT_PAGE_SIZE = 20;

function toRecord(doc: ResumeDoc): ResumeRecord {
  return {
    id: doc._id.toString(),
    name: doc.name,
    template: doc.template,
    data: doc.data,
    updatedAt: doc.updatedAt.toISOString(),
    createdAt: doc.createdAt.toISOString(),
  };
}

function toSummary(doc: {
  _id: Types.ObjectId;
  name: string;
  template: string;
  updatedAt: Date;
}): ResumeSummary {
  return {
    id: doc._id.toString(),
    name: doc.name,
    template: doc.template as ResumeTemplateId,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listResumesAction(input?: { page?: number; pageSize?: number }) {
  return authedNoInput(async (session) => {
    const page = Math.max(1, input?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input?.pageSize ?? DEFAULT_PAGE_SIZE));

    await connectMongo();
    const userId = new Types.ObjectId(session.userId);

    const [items, total] = await Promise.all([
      Resume.find({ userId })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select('_id name template updatedAt')
        .lean(),
      Resume.countDocuments({ userId }),
    ]);

    return success({
      items: items.map(toSummary),
      page,
      pageSize,
      total,
      hasMore: page * pageSize < total,
    });
  });
}

export async function getResumeAction(id: string) {
  return authedNoInput(async (session) => {
    const doc = await requireResume(id, session.userId);
    if (!doc) return failure('NOT_FOUND', 'Resume not found.');
    return success(toRecord(doc as ResumeDoc));
  });
}

export async function createResumeAction(input: {
  name?: string;
  template?: ResumeTemplateId;
  data?: ResumeDraft;
}) {
  return authed(createResumeInputSchema, input, async (data, session) => {
    await connectMongo();

    const seed = input.data ?? emptyResume();
    const created = await Resume.create({
      userId: new Types.ObjectId(session.userId),
      name: data.name?.trim() || 'Untitled resume',
      template: data.template ?? 'classic-teal',
      data: seed,
    });

    revalidatePath('/dashboard');
    return success({ id: created._id.toString() }, 'Resume created.');
  });
}

export async function autosaveResumeAction(input: {
  id: string;
  data: ResumeDraft;
  template?: ResumeTemplateId;
}) {
  return authed(autosaveResumeInputSchema, input, async (data, session) => {
    const existing = await requireResume(data.id, session.userId);
    if (!existing) return failure('NOT_FOUND', 'Resume not found.');

    const updated = await Resume.findByIdAndUpdate(
      data.id,
      {
        data: data.data,
        template: data.template ?? existing.template,
      },
      { new: true },
    ).lean();

    if (!updated) return failure('NOT_FOUND', 'Resume not found.');

    return success(
      { id: data.id, savedAt: updated.updatedAt.toISOString() },
      'Saved.',
    );
  });
}

export async function renameResumeAction(input: { id: string; name: string }) {
  return authed(renameResumeInputSchema, input, async (data, session) => {
    const existing = await requireResume(data.id, session.userId);
    if (!existing) return failure('NOT_FOUND', 'Resume not found.');

    await Resume.updateOne({ _id: data.id }, { name: data.name.trim() });
    revalidatePath('/dashboard');
    return success({ id: data.id }, 'Renamed.');
  });
}

export async function deleteResumeAction(input: { id: string }) {
  return authed(deleteResumeInputSchema, input, async (data, session) => {
    const existing = await requireResume(data.id, session.userId);
    if (!existing) return failure('NOT_FOUND', 'Resume not found.');

    await Resume.deleteOne({ _id: data.id });
    revalidatePath('/dashboard');
    return success({ id: data.id }, 'Resume deleted.');
  });
}

export async function importLocalDraftAction(input: { data: ResumeDraft }) {
  return authedNoInput(async (session) => {
    if (!input.data || typeof input.data !== 'object') {
      return failure('INVALID_DRAFT', 'That local draft could not be imported.');
    }

    await connectMongo();

    const created = await Resume.create({
      userId: new Types.ObjectId(session.userId),
      name: 'Imported draft',
      template: 'classic-teal',
      data: input.data,
    });

    revalidatePath('/dashboard');
    return success({ id: created._id.toString() }, 'Local draft imported.');
  });
}

export async function ensureSeedResume(userId: string) {
  await connectMongo();
  const oid = new Types.ObjectId(userId);
  const count = await Resume.countDocuments({ userId: oid });
  if (count > 0) return;
  await Resume.create({
    userId: oid,
    name: 'Sample resume',
    template: 'classic-teal',
    data: sampleResume,
  });
}
