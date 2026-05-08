'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AuthToggler() {
  const pathname = usePathname() ?? '';

  return (
    <div className="grid grid-cols-2 gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium">
      <Tab href="/auth/login" label="Log in" active={pathname.startsWith('/auth/login')} />
      <Tab href="/auth/signup" label="Sign up" active={pathname.startsWith('/auth/signup')} />
    </div>
  );
}

function Tab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-full px-4 py-2 text-center transition',
        active
          ? 'bg-white text-brand-800 shadow-sm'
          : 'text-slate-600 hover:text-slate-900',
      )}
    >
      {label}
    </Link>
  );
}
