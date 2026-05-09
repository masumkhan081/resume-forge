type LayoutProps = {
  preview?: string;
  heading: string;
  body: string;
  cta?: { label: string; url: string };
  footnote?: string;
};

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => escapeMap[c] ?? c);
}

export function renderEmail({ preview, heading, body, cta, footnote }: LayoutProps): string {
  const previewBlock = preview
    ? `<span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preview)}</span>`
    : '';

  const ctaBlock = cta
    ? `<div style="margin-top:24px;"><a href="${cta.url}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:9999px;font-weight:600;font-size:14px;">${escapeHtml(cta.label)}</a></div>`
    : '';

  const footnoteBlock = footnote
    ? `<p style="margin:24px 0 0;font-size:12px;color:#94a3b8;line-height:18px;">${footnote}</p>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
${previewBlock}
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;background:#f8fafc;">
  <tr><td align="center">
    <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;">
      <tr><td style="padding:32px;">
        <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;line-height:30px;">${escapeHtml(heading)}</h1>
        <div style="font-size:14px;line-height:24px;color:#475569;">${body}</div>
        ${ctaBlock}
        ${footnoteBlock}
      </td></tr>
      <tr><td style="padding:18px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">Resume Forge — typed builder + PDF export</td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
