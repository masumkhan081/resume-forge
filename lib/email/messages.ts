import 'server-only';

import { RESET_TOKEN_TTL_MINUTES } from '@/lib/auth/tokens';
import { sendEmail } from './transport';
import { welcomeEmail } from './templates/welcome';
import { passwordResetEmail } from './templates/password-reset';
import { passwordChangedEmail } from './templates/password-changed';
import { accountDeletedEmail } from './templates/account-deleted';
import type { EmailResult } from './types';

export async function sendWelcomeEmail(input: {
  to: string;
  fullName: string;
  dashboardUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    ...welcomeEmail({ fullName: input.fullName, dashboardUrl: input.dashboardUrl }),
  });
}

export async function sendPasswordResetEmail(input: {
  to: string;
  resetUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    ...passwordResetEmail({
      resetUrl: input.resetUrl,
      ttlMinutes: RESET_TOKEN_TTL_MINUTES,
    }),
  });
}

export async function sendPasswordChangedEmail(input: {
  to: string;
  recoveryUrl: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    ...passwordChangedEmail({ recoveryUrl: input.recoveryUrl }),
  });
}

export async function sendAccountDeletedEmail(input: {
  to: string;
  supportContact?: string;
}): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    ...accountDeletedEmail({ supportContact: input.supportContact }),
  });
}
