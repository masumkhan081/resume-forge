import 'server-only';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession, type Session } from '@/lib/auth/get-session';
import { failure, type ApiResult } from '@/lib/types/api';
import { firstIssueMessage } from '@/lib/schemas/utils';

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
  handler: (data: z.infer<TSchema>, session: Session) => Promise<ApiResult<TData>>,
): Promise<ApiResult<TData>> {
  const session = await getSession();
  if (!session) return failure('UNAUTHORIZED', 'Please log in.');

  const parsed = schema.safeParse(input);
  if (!parsed.success) return failure('INVALID_INPUT', firstIssueMessage(parsed.error));

  return handler(parsed.data, session);
}

export async function authedNoInput<TData>(
  handler: (session: Session) => Promise<ApiResult<TData>>,
): Promise<ApiResult<TData>> {
  const session = await getSession();
  if (!session) return failure('UNAUTHORIZED', 'Please log in.');
  return handler(session);
}

export async function requireResume(id: string, userId: string) {
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume || resume.userId !== userId) return null;
  return resume;
}
