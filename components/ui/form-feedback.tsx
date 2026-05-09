import { Banner } from './banner';

export function FormFeedback({
  error,
  success,
  info,
  warning,
}: {
  error?: string;
  success?: string;
  info?: string;
  warning?: React.ReactNode;
}) {
  if (!error && !success && !info && !warning) return null;
  return (
    <div className="space-y-2">
      {error ? <Banner variant="error">{error}</Banner> : null}
      {warning ? <Banner variant="warning" size="xs">{warning}</Banner> : null}
      {success ? <Banner variant="success">{success}</Banner> : null}
      {info ? <Banner variant="info">{info}</Banner> : null}
    </div>
  );
}
