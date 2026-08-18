# TipSplit

A mobile-first web app for restaurant, bar, and salon managers to calculate
end-of-shift tip distribution in under 60 seconds — replacing the shared
spreadsheet.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase
(magic-link auth, Postgres, RLS) · Stripe Checkout (test mode) · Vercel.

## Project status

Foundation only (task 1 of 4). The calculator, marketing pages, `/app`
workspace, and seed script are later tasks. `/calculator` and `/app` currently
render placeholder stubs.

## Prerequisites

- Node.js 20+ (developed on 22)
- npm 10+

## Getting started

```bash
cd /home/team/shared/tipsplit
npm install

# Create your local env file from the template:
cp .env.example .env.local
# ...then fill in real Supabase / Stripe values (placeholders are included so
# the app builds and runs without credentials).
```

### Run the dev server

> **Note on the port:** port 3000 is often occupied by another service on this
> machine (the team's shared site). Run the dev server on a different port:

```bash
npm run dev -- -p 3001
# open http://localhost:3001
```

### Build & lint

```bash
npm run build     # production build (must pass clean)
npm run lint      # eslint
```

## Environment variables

See `.env.example` for the full list:

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth, data | Public — safe in the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, data | Public — safe in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin ops (seed script) | **Server-only, never expose** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Checkout | Public |
| `STRIPE_SECRET_KEY` | Checkout (server) | **Server-only** |
| `STRIPE_PRICE_PRO_MONTHLY` | Checkout (server) | Stripe Price ID for Pro $12/mo |
| `NEXT_PUBLIC_APP_URL` | Magic-link redirects, canonicals | e.g. `http://localhost:3001` |

Env access is centralized in `lib/env.ts` — `require*()` helpers throw
descriptive errors for missing vars; `getSupabaseAnonConfig()` returns `null`
so UI can render a graceful "auth is not configured" state (see `/login`).

## Supabase setup

1. Create a project, grab URL + anon key, and put them in `.env.local`.
2. Apply the migration:

```bash
npx supabase link --project-ref <ref>     # if using the Supabase CLI
npx supabase db push                      # applies supabase/migrations/
```

Or run `supabase/migrations/0001_init.sql` manually in the SQL editor.

The migration creates `profiles`, `staff`, `presets`, and `shifts`, enables
RLS on all four (scoped to `auth.uid()`), and installs a trigger on
`auth.users` that auto-creates the matching `profiles` row on sign-up.

## Project structure

```
app/
  layout.tsx          Root layout: metadata + persistent legal footer
  page.tsx            Placeholder home (landing page is a later task)
  login/page.tsx      Magic-link login (idle / loading / sent / error states)
  app/page.tsx        Placeholder /app (protected by middleware)
  calculator/page.tsx Placeholder /calculator
lib/
  env.ts              Centralized env access
  supabase/
    client.ts         Browser client (createBrowserClient)
    server.ts         Server component client (createServerClient + cookies)
    middleware.ts     updateSession flow
supabase/migrations/  0001_init.sql
middleware.ts         Session refresh + /app protection
```
