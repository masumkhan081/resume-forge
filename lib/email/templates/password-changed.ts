import { renderEmail } from './_layout';

export function passwordChangedEmail({ recoveryUrl }: { recoveryUrl: string }) {
  const html = renderEmail({
    preview: 'Your Resume Forge password was changed.',
    heading: 'Your password was changed',
    body: `<p style="margin:0 0 12px;">This is a confirmation that your Resume Forge password was just updated. All other devices have been signed out.</p>
<p style="margin:0;">If this wasn't you, reset your password immediately and review your recent sessions.</p>`,
    cta: { label: 'I did not do this — reset now', url: recoveryUrl },
    footnote: `For your security, we never include passwords in email.`,
  });
  const text = `Your Resume Forge password was just changed. All other devices have been signed out.

If this wasn't you, reset immediately:
${recoveryUrl}`;
  return { subject: 'Your Resume Forge password was changed', html, text };
}
