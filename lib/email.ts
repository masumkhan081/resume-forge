import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';
import { env, isEmailConfigured } from '@/lib/env';
import { logger } from '@/lib/logger';

let cached: Transporter | null = null;

function getTransport(): Transporter | null {
  if (cached) return cached;
  if (!isEmailConfigured) return null;

  cached = nodemailer.createTransport({
    host: env.SMTP_HOST!,
    port: env.SMTP_PORT!,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER!,
      pass: env.SMTP_PASS!,
    },
  });
  return cached;
}

export type EmailInput = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
};

export type EmailResult =
  | { ok: true; messageId: string }
  | { ok: false; reason: 'EMAIL_DISABLED' | 'PROVIDER_FAILED'; error?: string };

export async function sendEmail(input: EmailInput): Promise<EmailResult> {
  const transport = getTransport();
  if (!transport) {
    logger.warn('Email provider not configured — message dropped', {
      to: input.to,
      subject: input.subject,
    });
    return { ok: false, reason: 'EMAIL_DISABLED' };
  }

  try {
    const info = await transport.sendMail({
      from: env.EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? stripHtml(input.html ?? ''),
      replyTo: input.replyTo,
    });
    logger.info('email.sent', { to: input.to, subject: input.subject, messageId: info.messageId });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('email.failed', { to: input.to, subject: input.subject, error: message });
    return { ok: false, reason: 'PROVIDER_FAILED', error: message };
  }
}

export async function verifyEmailTransport(): Promise<EmailResult> {
  const transport = getTransport();
  if (!transport) {
    return { ok: false, reason: 'EMAIL_DISABLED' };
  }
  try {
    await transport.verify();
    return { ok: true, messageId: 'verify-ok' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: 'PROVIDER_FAILED', error: message };
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
