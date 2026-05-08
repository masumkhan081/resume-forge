import { z } from 'zod';

export function firstIssueMessage(error: z.ZodError, fallback = 'Please check your input.') {
  return error.issues[0]?.message ?? fallback;
}
