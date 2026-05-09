import { renderEmail } from './_layout';

export function accountDeletedEmail({ supportContact }: { supportContact?: string } = {}) {
  const supportLine = supportContact
    ? `<p style="margin:0;">If you didn't request this, contact us at <a href="mailto:${supportContact}" style="color:#0f766e;">${supportContact}</a> immediately.</p>`
    : `<p style="margin:0;">If you didn't request this, reply to this email immediately.</p>`;

  const html = renderEmail({
    preview: 'Your Resume Forge account has been deleted.',
    heading: 'Your account has been deleted',
    body: `<p style="margin:0 0 12px;">Your Resume Forge account and all associated resumes have been permanently removed.</p>
${supportLine}`,
    footnote: `This action is final. Your data has been deleted from our database.`,
  });
  const text = `Your Resume Forge account has been deleted along with all associated resumes. This action is final.

If you didn't request this${supportContact ? `, contact ${supportContact}` : ', reply to this email'} immediately.`;
  return { subject: 'Your Resume Forge account was deleted', html, text };
}
