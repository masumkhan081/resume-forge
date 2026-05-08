export function AuthHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
        {eyebrow}
      </p>
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </header>
  );
}
