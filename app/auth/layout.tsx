import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Auth',
  description: 'Sign in or create your Resume Forge account.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
      <Card className="mx-auto w-full max-w-xl space-y-6 p-6 sm:p-8">{children}</Card>
    </main>
  );
}
