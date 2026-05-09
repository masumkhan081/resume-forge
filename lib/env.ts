import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required.')
    .refine(
      (value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
      'MONGODB_URI must start with mongodb:// or mongodb+srv://',
    ),
  MONGODB_DB_NAME: z.string().min(1).default('resume-forge'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url().default('http://localhost:3000'),

  AUTH_SECRET: z.string().min(16, 'AUTH_SECRET must be at least 16 characters.'),
  AUTH_TRUST_HOST: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  EMAIL_PROVIDER: z.enum(['smtp', 'console']).optional(),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).default('Resume Forge <noreply@example.com>'),

  SENTRY_DSN: z.string().url().optional(),
});

const parsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || undefined,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || undefined,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
  SENTRY_DSN: process.env.SENTRY_DSN,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;
export const isProd = parsed.data.NODE_ENV === 'production';
export const isDev = parsed.data.NODE_ENV === 'development';

export const isEmailConfigured = Boolean(
  env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS,
);

export const isGoogleAuthEnabled = Boolean(
  env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET,
);
