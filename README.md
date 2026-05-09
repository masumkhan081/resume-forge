# Resume Forge

A production-oriented **Next.js + TypeScript** resume builder with multiple templates, PDF export, autosave, and OAuth-ready auth.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Auth.js v5 (NextAuth) — Credentials + Google, JWT sessions, MongoDB adapter
- MongoDB Atlas via Mongoose
- bcryptjs for credentials hashing
- React Hook Form + Zod (centralized in `lib/schemas/`)
- Brevo SMTP via nodemailer (provider-pluggable email layer)
- @react-pdf/renderer for PDF export
- Tailwind CSS + lucide-react
- Vitest

## Layout

```
app/                       # routes (App Router)
  api/auth/[...nextauth]/  # Auth.js handlers
  api/health/              # /api/health: pings MongoDB
  (app)/                   # protected routes (dashboard, builder, resume, profile)
  auth/                    # public auth routes (login, signup, recovery, reset, verify)
auth.config.ts             # Edge-safe Auth.js config (used by middleware)
auth.ts                    # Node Auth.js config (providers + adapter)
middleware.ts              # HTTPS enforcement + Auth.js authorized callback
lib/
  actions/                 # typed Server Actions (session, account, resume)
  auth/                    # password hashing, tokens, get-session
  email/                   # provider-pluggable email + transactional wrappers + templates
  hooks/                   # useZodForm, useAutosave
  models/                  # Mongoose models (User, Resume, PasswordResetToken)
  schemas/                 # Zod schemas (single source of truth)
  templates/               # template registry
  types/                   # shared types + API result types
  env.ts                   # Zod-validated env (single .env file only)
  logger.ts                # JSON structured logging + captureException stub
  rate-limit.ts            # in-memory sliding-window per-key
components/
  auth/                    # auth-specific components
  builder/                 # resume builder, steps, sortable list, autosave indicator
  builder/templates/       # web + PDF template implementations
  dashboard/               # dashboard-specific components
  profile/                 # profile-specific components
  ui/                      # primitives: Button, LinkButton, Field, Card, Banner, etc.
prisma/                    # (none — using Mongoose, not Prisma)
tests/
  schemas/                 # Zod schema tests
```

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

You will need a populated `.env` (see below) before signup/login works against MongoDB Atlas.

## Environment

**One `.env` file only.** No `.env.example`, `.env.local`, etc. — `lib/env.ts` is the single zod-validated source of truth.

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB Atlas connection string. Must start with `mongodb://` or `mongodb+srv://`. |
| `MONGODB_DB_NAME` | no (defaults `resume-forge`) | Database name within the cluster. |
| `NEXT_PUBLIC_BASE_URL` | no (defaults `http://localhost:3000`) | Used in email links and OG metadata. **Set this in production.** |
| `AUTH_SECRET` | yes | 32-byte secret for JWT signing. Generate with `pnpm dlx auth secret` or `openssl rand -base64 32`. |
| `AUTH_TRUST_HOST` | yes (in prod) | Set to `true` when running behind a reverse proxy / Vercel. |
| `AUTH_GOOGLE_ID` | optional | Google OAuth client id. When unset, the Google button is hidden. |
| `AUTH_GOOGLE_SECRET` | optional | Google OAuth client secret. |
| `EMAIL_PROVIDER` | optional | `smtp` or `console`. Auto-detects: SMTP if `SMTP_HOST` set, else `console` (logs payload). |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | required for SMTP | Brevo or any SMTP relay. |
| `EMAIL_FROM` | no (defaults `Resume Forge <noreply@example.com>`) | `From` header. **Must match a verified sender** in your provider. |
| `SENTRY_DSN` | optional | Reserved hook for error reporting. |

## Commands

```bash
pnpm dev          # Next.js dev server
pnpm build        # production build
pnpm start        # serve the production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm test         # Vitest
pnpm test:watch   # Vitest in watch mode
```

## Security checklist (production)

- [ ] `AUTH_SECRET` is unique per environment and stored as a secret
- [ ] `AUTH_TRUST_HOST=true` set behind any reverse proxy
- [ ] `NEXT_PUBLIC_BASE_URL` matches the public origin (used in recovery links)
- [ ] `MONGODB_URI` user has least-privilege access (read/write to one database, no admin)
- [ ] Atlas Network Access allowlist locked to deployment egress IPs (not `0.0.0.0/0`)
- [ ] Email sender verified with the provider; DKIM/SPF records added if you control the sender domain
- [ ] HTTPS terminated at the edge — middleware enforces upgrade if the request comes in as `http`
- [ ] Headers: HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy applied via `next.config.mjs`
- [ ] No `.env` content committed (`.env` is gitignored)
- [ ] Rotate any credentials that appeared in chat / shared transcripts

## Deployment (Vercel)

1. Import the repository in Vercel.
2. Add the env vars above under **Settings → Environment Variables** (Production).
3. Atlas: add Vercel egress IPs (or temporarily `0.0.0.0/0` for first connect, then tighten).
4. Set `AUTH_TRUST_HOST=true` so Auth.js trusts Vercel's proxy.
5. Set `NEXT_PUBLIC_BASE_URL` to the deployed origin (e.g. `https://resume-forge.vercel.app`).
6. Deploy. Visit `/api/health` — it should return `{"ok":true,"db":{"ok":true,"latencyMs":...}}`.

## Tradeoffs / known gaps

- JWT sessions cannot be invalidated server-side mid-flight (standard JWT tradeoff). Password reset deletes server-side sessions for the user; old JWT cookies expire naturally at 30 days.
- The `/auth/verify` (OTP) flow is intentionally parked scaffolding — signup goes straight to `/dashboard`.
- No Sentry SDK installed; `lib/logger.ts` exposes a `captureException()` hook ready to forward when `SENTRY_DSN` is set.
- Autosave debounce is 1.5s; on accidental tab close mid-debounce, the `beforeunload` handler warns the user.

## Tests

Schema and action-level coverage in `tests/`:

```bash
pnpm test
```

Run a single file:

```bash
pnpm test -- tests/schemas/resume.test.ts
```
