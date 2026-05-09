import 'server-only';

import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import type { EmailInput, EmailProvider, EmailResult } from './types';
import { createSmtpProvider } from './providers/smtp';
import { createConsoleProvider } from './providers/console';

const providerFactories = {
  smtp: createSmtpProvider,
  console: createConsoleProvider,
} as const;

type ProviderName = keyof typeof providerFactories;

let cached: EmailProvider | null = null;

function detectProvider(): ProviderName {
  if (env.EMAIL_PROVIDER) return env.EMAIL_PROVIDER as ProviderName;
  if (env.SMTP_HOST) return 'smtp';
  return 'console';
}

function getProvider(): EmailProvider {
  if (cached) return cached;

  const name = detectProvider();
  const factory = providerFactories[name];
  const provider = factory();
  if (!provider) {
    throw new Error(
      `Email provider "${name}" is selected but its configuration is missing. Check your .env.`,
    );
  }
  cached = provider;
  logger.info('email.provider.selected', { provider: name });
  return cached;
}

export async function sendEmail(input: EmailInput): Promise<EmailResult> {
  return getProvider().send(input);
}

export async function verifyEmailTransport(): Promise<EmailResult> {
  return getProvider().verify();
}

export function activeProviderName(): string {
  return getProvider().name;
}
