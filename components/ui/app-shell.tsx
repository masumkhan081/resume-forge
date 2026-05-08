import Link from 'next/link';
import { FileText } from 'lucide-react';
import { getSession } from '@/lib/auth/get-session';
import { signOutAndRedirect } from '@/lib/actions/session-actions';
import { Footer } from './footer';

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link
            href={session ? '/dashboard' : '/'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink sm:gap-3"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-sm sm:h-10 sm:w-10">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="leading-tight">
              Resume Forge
              <span className="hidden text-xs font-normal text-slate-500 sm:block">
                typed builder + PDF export
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-slate-600 sm:gap-4">
            {session ? (
              <>
                <Link href="/dashboard" className="transition hover:text-brand-700">
                  Dashboard
                </Link>
                <Link href="/profile" className="transition hover:text-brand-700">
                  Profile
                </Link>
                <form action={signOutAndRedirect}>
                  <button
                    type="submit"
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:text-sm"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full bg-brand-700 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-800 sm:text-sm"
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
