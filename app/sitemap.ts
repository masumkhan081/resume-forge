import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_BASE_URL;
  return [
    { url: `${base}/`, priority: 1, changeFrequency: 'weekly' },
    { url: `${base}/auth/login`, priority: 0.6, changeFrequency: 'yearly' },
    { url: `${base}/auth/signup`, priority: 0.6, changeFrequency: 'yearly' },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: 'yearly' },
  ];
}
