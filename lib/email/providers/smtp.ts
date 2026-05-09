import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '@/lib/env';
import type { EmailInput, EmailProvider, EmailResult } from '../types';

let cachedTransport: Transporter | null = null;

function getTransport(): Transporter | null {
  if (cachedTransport) return cachedTransport;
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }
  cachedTransport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return cachedTransport;
}

export function createSmtpProvider(): EmailProvider | null {
  const transport = getTransport();
  if (!transport) return null;

  return {
    name: 'smtp',
    async send(input: EmailInput): Promise<EmailResult> {
      try {
        const info = await transport.sendMail({
          from: env.EMAIL_FROM,
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text,
          replyTo: input.replyTo,
        });
        return { ok: true, messageId: info.messageId };
      } catch (error) {
        return {
          ok: false,
          reason: 'PROVIDER_FAILED',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    async verify(): Promise<EmailResult> {
      try {
        await transport.verify();
        return { ok: true, messageId: 'smtp-verified' };
      } catch (error) {
        return {
          ok: false,
          reason: 'PROVIDER_FAILED',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
