# Resume Forge

A unified **Next.js + TypeScript** rewrite of the original Firebase-based resume builder.

## What this version does

- keeps the original product intent: auth entry, multi-step resume builder, chip/list inputs, preview, PDF export
- removes the split frontend/backend mess
- uses a single Next.js codebase with App Router
- includes a typed server action scaffold for future DB persistence
- runs immediately with local draft persistence so you can develop from here

## Why I did not reuse the old backend

The uploaded `resume-backend` was not a clean resume backend. It contains mismatched domain leftovers and would make the product worse if used as a foundation.

## Commands

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`

## Current architecture

- `app/` – pages and route handlers
- `components/builder/` – form flow, preview, PDF document
- `components/ui/` – shared UI primitives
- `lib/actions/` – typed server actions
- `lib/schemas/` – zod validation
- `lib/types/` – shared types and API result types

## Honest gaps left intentionally

- no real database persistence yet
- auth is scaffolded for local demo instead of production auth
- one template for now, but data model is template-ready

## Recommended next steps

1. Add real auth via Clerk, Auth.js, or Firebase Auth if you still want it.
2. Replace local draft storage with MongoDB or Postgres.
3. Add template switching and saved resume history.
4. Add image upload and better print typography.
