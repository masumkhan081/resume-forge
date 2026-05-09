import { logger } from '@/lib/logger';
import type { EmailInput, EmailProvider, EmailResult } from '../types';

export function createConsoleProvider(): EmailProvider {
  return {
    name: 'console',
    async send(input: EmailInput): Promise<EmailResult> {
      logger.info('email.console.send', {
        to: input.to,
        subject: input.subject,
        preview: (input.text ?? '').slice(0, 140),
      });
      return { ok: true, messageId: `console-${Date.now()}` };
    },
    async verify(): Promise<EmailResult> {
      return { ok: true, messageId: 'console-ok' };
    },
  };
}
