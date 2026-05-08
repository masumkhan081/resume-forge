import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
        <p>© {year} Resume Forge</p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="transition hover:text-brand-700">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-brand-700">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
