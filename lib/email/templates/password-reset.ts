import { renderEmail } from './_layout';

export function passwordResetEmail({
  resetUrl,
  ttlMinutes,
}: {
  resetUrl: string;
  ttlMinutes: number;
}) {
  const html = renderEmail({
    preview: 'Reset your Resume Forge password.',
    heading: 'Reset your password',
    body: `<p style="margin:0 0 12px;">We received a request to reset your Resume Forge password. Use the button below to set a new one. This link expires in ${ttlMinutes} minutes.</p>
<p style="margin:0;">If you did not request this, you can safely ignore this email — your password stays the same.</p>`,
    cta: { label: 'Set a new password', url: resetUrl },
    footnote: `For security, this link can only be used once. If it expires, request a fresh recovery email.`,
  });
  const text = `Reset your Resume Forge password.

This link expires in ${ttlMinutes} minutes:
${resetUrl}

If you didn't request a reset, ignore this email — your password is unchanged.`;
  return { subject: 'Reset your Resume Forge password', html, text };
}
