import 'server-only';

import { Types } from 'mongoose';
import { z } from 'zod';
import { connectMongo } from '@/lib/mongodb';
import { Resume } from '@/lib/models/resume';
import { auth } from '@/auth';
import { failure, type ApiResult } from '@/lib/types/api';
import { firstIssueMessage } from '@/lib/schemas/utils';

export type AuthSession = {
  userId: string;
  email: string;
  name: string | null;
};

async function loadSession(): Promise<AuthSession | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return null;
  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
  };
}

export async function validated<TSchema extends z.ZodTypeAny, TData>(
  schema: TSchema,
  input: unknown,
  handler: (data: z.infer<TSchema>) => Promise<ApiResult<TData>>,
): Promise<ApiResult<TData>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return failure('INVALID_INPUT', firstIssueMessage(parsed.error));
  return handler(parsed.data);
}

export async function authed<TSchema extends z.ZodTypeAny, TData>(
  schema: TSchema,
  input: unknown,
  handler: (data: z.infer<TSchema>, session: AuthSession) => Promise<ApiResult<TData>>,
): Promise<ApiResult<TData>> {
  const session = await loadSession();
  if (!session) return failure('UNAUTHORIZED', 'Please log in.');

  const parsed = schema.safeParse(input);
  if (!parsed.success) return failure('INVALID_INPUT', firstIssueMessage(parsed.error));

  return handler(parsed.data, session);
}

export async function authedNoInput<TData>(
  handler: (session: AuthSession) => Promise<ApiResult<TData>>,
): Promise<ApiResult<TData>> {
  const session = await loadSession();
  if (!session) return failure('UNAUTHORIZED', 'Please log in.');
  return handler(session);
}

export async function requireResume(id: string, userId: string) {
  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) return null;
  await connectMongo();
  const resume = await Resume.findById(id).lean();
  if (!resume) return null;
  if (resume.userId.toString() !== userId) return null;
  return resume;
}
