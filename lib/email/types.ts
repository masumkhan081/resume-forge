export type EmailInput = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
};

export type EmailFailureReason =
  | 'EMAIL_DISABLED'
  | 'PROVIDER_FAILED'
  | 'PROVIDER_MISCONFIGURED';

export type EmailResult =
  | { ok: true; messageId: string }
  | { ok: false; reason: EmailFailureReason; error?: string };

export interface EmailProvider {
  readonly name: string;
  send(input: EmailInput): Promise<EmailResult>;
  verify(): Promise<EmailResult>;
}
