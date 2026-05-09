import Link from 'next/link';
import { FileText, LayoutGrid, LogOut, User } from 'lucide-react';
import { getSession } from '@/lib/auth/get-session';
import { signOutAndRedirect } from '@/lib/actions/session-actions';
import { Footer } from './footer';

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:items-center focus:rounded-full focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link
            href={session ? '/dashboard' : '/'}
            aria-label="Resume Forge home"
            className="inline-flex min-w-0 items-center gap-2 rounded-full text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 sm:gap-3"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-sm sm:h-10 sm:w-10">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate">Resume Forge</span>
              <span className="hidden text-xs font-normal text-slate-500 sm:block">
                typed builder + PDF export
              </span>
            </span>
          </Link>

          <nav className="flex shrink-0 items-center gap-1 text-sm text-slate-600 sm:gap-3">
            {session ? (
              <>
                <NavLink href="/dashboard" label="Dashboard" icon={<LayoutGrid className="h-4 w-4" aria-hidden />} />
                <NavLink href="/profile" label="Profile" icon={<User className="h-4 w-4" aria-hidden />} />
                <form action={signOutAndRedirect}>
                  <button
                    type="submit"
                    aria-label="Log out"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 sm:px-3 sm:text-sm"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Log out</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 sm:px-4 sm:text-sm"
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <div id="main-content" className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 transition hover:bg-slate-100 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 sm:px-3"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
