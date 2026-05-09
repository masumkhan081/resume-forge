import { escapeHtml, renderEmail } from './_layout';

export function welcomeEmail({
  fullName,
  dashboardUrl,
}: {
  fullName: string;
  dashboardUrl: string;
}) {
  const greeting = fullName ? escapeHtml(fullName.split(' ')[0]) : 'there';
  const html = renderEmail({
    preview: 'Welcome to Resume Forge — your workspace is ready.',
    heading: `Welcome, ${greeting}.`,
    body: `<p style="margin:0 0 12px;">Your Resume Forge account is ready. Build, switch templates, preview, and export PDFs — all in one place.</p>
<p style="margin:0;">Jump in below and start your first resume.</p>`,
    cta: { label: 'Open dashboard', url: dashboardUrl },
    footnote: `If you didn't sign up for Resume Forge, you can ignore this email.`,
  });
  const text = `Welcome to Resume Forge, ${fullName || 'there'}.

Your account is ready. Open the dashboard to get started:
${dashboardUrl}

If you didn't sign up, ignore this email.`;
  return { subject: 'Welcome to Resume Forge', html, text };
}
