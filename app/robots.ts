import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_BASE_URL;
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/auth/login', '/auth/signup'],
        disallow: [
          '/dashboard',
          '/builder',
          '/resume',
          '/profile',
          '/auth/verify',
          '/auth/recovery',
          '/auth/reset',
          '/api/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
