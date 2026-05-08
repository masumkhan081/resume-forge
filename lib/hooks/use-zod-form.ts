'use client';

import { useState, useTransition } from 'react';
import type { z } from 'zod';
import { firstIssueMessage } from '@/lib/schemas/utils';
import type { ApiResult } from '@/lib/types/api';

type Options<TSchema extends z.ZodTypeAny, TResult> = {
  schema: TSchema;
  action: (input: z.infer<TSchema>) => Promise<ApiResult<TResult>>;
  onSuccess?: (data: TResult, message?: string) => void;
};

export function useZodForm<TSchema extends z.ZodTypeAny, TResult>({
  schema,
  action,
  onSuccess,
}: Options<TSchema, TResult>) {
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [pending, startTransition] = useTransition();

  function submit(raw: unknown) {
    setError('');
    setInfo('');
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      setError(firstIssueMessage(parsed.error));
      return;
    }
    startTransition(async () => {
      const result = await action(parsed.data);
      if (result.ok) {
        if (result.message) setInfo(result.message);
        onSuccess?.(result.data, result.message);
      } else {
        setError(result.error.message);
      }
    });
  }

  function handleFormAction(formData: FormData) {
    submit(Object.fromEntries(formData.entries()));
  }

  return { submit, handleFormAction, error, info, pending, setError, setInfo };
}
