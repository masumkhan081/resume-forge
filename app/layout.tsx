import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppShell } from '@/components/ui/app-shell';
import { ToastProvider } from '@/components/ui/toast-provider';
import { env } from '@/lib/env';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  title: {
    default: 'Resume Forge',
    template: '%s · Resume Forge',
  },
  description:
    'Multi-step resume builder with typed Next.js architecture, multiple templates, and PDF export.',
  openGraph: {
    title: 'Resume Forge',
    description:
      'Build, switch templates, preview, and export your resume — all in one typed Next.js workspace.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
