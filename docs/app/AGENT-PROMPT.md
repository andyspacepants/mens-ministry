# Culture of Manhood App — Agent Build Prompt

> Copy everything below the line into a fresh Claude Code session.
> Prerequisites: Docker running, Clerk project created (keys in instructions below).
> Run with: `--dangerously-skip-permissions`

---

## Context

You are building a new project: **Culture of Manhood App** — a proactive engagement platform for men's ministry communities. Read the full product spec at `~/dev/mens-ministry/docs/app/README.md` before starting any work.

This is a **new, separate project** from the existing landing page. Create it at `~/dev/cultureofmanhood-app/`.

### What This App Does

Once a month, enrolled men receive a text message with a link to a 5-question check-in form (scored 0–5). The system responds based on scores:
- **Score 5**: Captures a testimony, encourages the man to share it with others
- **Score 4/3/2**: Data captured, no follow-up
- **Score 1**: System texts a "wrangler" (volunteer) to reach out with a phone call
- **Score 0**: Emergency — all wranglers + leaders notified immediately

Men sign up via their church's landing page (e.g., `jlc.cultureofmanhood.com` → link to `app.cultureofmanhood.com/join/jlc`). New sign-ups require wrangler approval before gaining access.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | TanStack Start (SSR) + TanStack Router + TanStack Query + React 19 + Tailwind 4 + shadcn/ui |
| **Backend** | Fastify + Zod type provider (separate API server) |
| **Database** | PostgreSQL 16 + Drizzle ORM (Docker for local dev) |
| **Auth** | Clerk via `@clerk/tanstack-react-start` (Google sign-in) |
| **SMS** | STUB (log to console — Twilio will be wired up later) |
| **Email** | STUB (log to console — Postmark will be wired up later) |
| **Runtime** | Bun (NOT Node.js — see rules below) |
| **Code Quality** | Biome + Husky + lint-staged |

### Bun Rules (CRITICAL)

- Use `bun` not `node`, `npm`, `npx`, `yarn`, or `pnpm`
- Use `bun install`, `bun add`, `bun run`, `bun test`, `bunx`
- Bun auto-loads `.env` — do NOT use dotenv
- Use `Bun.file()` over `fs.readFile`/`fs.writeFile`

### Architecture: Two Servers

- **TanStack Start** (port 4001) — all user-facing UI, SSR, routing
- **Fastify** (port 4301) — all API routes, webhooks, database access, background services
- **PostgreSQL** (port 4601) — Docker container
- **TanStack Query** bridges frontend → Fastify API
- Vinxi config proxies `/api/*` from Start → Fastify in dev (single browser origin)

Server functions are NOT used for data mutations. All data flows through the Fastify API. TanStack Start only handles rendering and routing.

### Clerk Setup

The Clerk project is already created. Use `@clerk/tanstack-react-start` (NOT `@clerk/fastify` for the frontend).

**TanStack Start integration pattern:**

1. `app/ssr.tsx` — add `clerkMiddleware()` to `createStart()` request middleware:
```typescript
import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => ({
  requestMiddleware: [clerkMiddleware()],
}))
```

2. `app/routes/__root.tsx` — wrap shell in `<ClerkProvider>`:
```typescript
import { ClerkProvider } from '@clerk/tanstack-react-start'

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

3. Client-side auth components: `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<UserButton>` from `@clerk/tanstack-react-start`

4. Server-side route protection:
```typescript
import { auth } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

const authStateFn = createServerFn('GET', async () => {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated) {
    throw redirect({ to: '/sign-in' })
  }
  return { userId }
})

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => await authStateFn(),
})
```

5. Fastify — verify Clerk JWT on API requests: extract token from `Authorization: Bearer <token>` header, verify using Clerk's backend SDK or JWKS endpoint.

**Environment variables (already have these — put in `.env`):**
```
CLERK_PUBLISHABLE_KEY=pk_test_c3R1bm5pbmctamF5LTcwLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_WUNI1itfukj0V2M98SDm0nmFDtcdyfMO35SncuZzea
```

### Reference Projects

Before building, read these for patterns:
- `~/dev/project-starter/docs/DECISIONS.md` — stack decisions and escalation framework
- `~/dev/project-enablers/patterns/database/` — Drizzle + Postgres setup patterns
- `~/dev/project-enablers/apis/postmark/README.md` — native fetch API pattern (use same for Twilio stub)
- `~/dev/project-enablers/patterns/secrets/` — env file patterns

---

## Work Streams (Use Agent Teams)

Parallelize independent work. Streams A+B have no dependencies — start them first. C+D depend on A+B. E depends on all others.

### Stream A: Database Layer

Create `db/` directory with full Drizzle + PostgreSQL setup.

**Files to create:**
- `docker-compose.yml` — PostgreSQL 16 Alpine, port 4601, user `app_user`, password `dev_password`, database `cultureofmanhood_dev`
- `drizzle.config.ts` — schema from `db/schema/*`, output to `db/migrations`, dialect postgresql
- `db/index.ts` — postgres client + Drizzle instance, reads `DATABASE_URL` from env
- `db/schema/church.ts` — id (uuid pk), name (text), slug (text unique), created_at, updated_at
- `db/schema/user.ts` — id (uuid pk), clerk_id (text unique), church_id (fk→church), role (enum: man/wrangler/leader), status (enum: pending/active/inactive), first_name, last_name, email, phone, date_of_birth (date), service_attended (text), is_church_member (boolean), created_at, updated_at
- `db/schema/checkin.ts` — id (uuid pk), user_id (fk→user), church_id (fk→church), month (date), lord_score (int 0-5), spouse_score, kids_score, work_score, personal_score, testimonies (jsonb — array of {category, text}), created_at, updated_at. Unique constraint on (user_id, month).
- `db/schema/notification-log.ts` — id (uuid pk), church_id (fk→church), recipient_user_id (fk→user), type (enum: checkin_reminder/checkin_followup/outreach_request/emergency/new_signup/approval), channel (enum: sms/email), status (enum: queued/sent/delivered/failed), metadata (jsonb), created_at, sent_at
- `db/schema/outreach-event.ts` — id (uuid pk), church_id (fk→church), checkin_id (fk→checkin), requesting_user_id (fk→user), wrangler_user_id (fk→user nullable), category (text), score (int), status (enum: pending/notified/acknowledged/completed), created_at, updated_at
- `db/seed.ts` — seeds JLC church (slug: "jlc", name: "Journey Life Church") and one leader user record

Run `bunx drizzle-kit generate` to create the initial migration. Run `bunx drizzle-kit migrate` to apply it.

### Stream B: Shared Layer

Create `shared/` directory with types and Zod schemas used by both frontend and backend.

**Files to create:**
- `shared/types.ts`:
  - `UserRole` enum: `man`, `wrangler`, `leader`
  - `UserStatus` enum: `pending`, `active`, `inactive`
  - `NotificationType` enum: `checkin_reminder`, `checkin_followup`, `outreach_request`, `emergency`, `new_signup`, `approval`
  - `NotificationChannel` enum: `sms`, `email`
  - `NotificationStatus` enum: `queued`, `sent`, `delivered`, `failed`
  - `OutreachStatus` enum: `pending`, `notified`, `acknowledged`, `completed`
  - `SCORE_LABELS`: map of 0-5 to meaning strings ("Emergency", "Could use a phone call", "Rough month", "Steady", "Going really well", "I have a story to tell")
  - `CHECKIN_CATEGORIES`: array of { key, label } for the 5 categories (lord, spouse, kids, work, personal)
- `shared/schemas/user.ts` — Zod schemas for user profile creation/update (CreateUserSchema, UpdateUserSchema)
- `shared/schemas/checkin.ts` — Zod schemas for check-in submission (CreateCheckinSchema — validates each score 0-5, requires testimonies array when any score is 5)
- `shared/schemas/admin.ts` — Zod schemas for admin actions (ApproveUserSchema, UpdateRoleSchema)

### Stream C: Fastify API Server

Create `server/` directory with all API routes. Depends on Streams A + B.

**Files to create:**
- `server/index.ts` — Fastify setup: CORS (allow TanStack Start origin), Zod type provider, register all route plugins, listen on port 4301. Add a `GET /api/health` route that returns `{ status: "ok" }`.
- `server/plugins/clerk.ts` — Fastify plugin: extract `Authorization: Bearer <token>` header, verify with Clerk backend SDK, attach `userId` (Clerk ID) to request. If no token or invalid, return 401.
- `server/middleware/auth.ts` — Fastify preHandler: requires Clerk auth, looks up app user by `clerk_id`, attaches `user` and `churchId` to request. If user not found in DB, return 403 with `{ error: "profile_required" }`.
- `server/middleware/roles.ts` — Fastify preHandler factory: `requireRole('wrangler')` or `requireRole('leader')` — checks user role, returns 403 if insufficient.
- `server/routes/users.ts`:
  - `GET /api/me` — returns current user's profile (or 404 if no profile yet)
  - `POST /api/me` — creates user profile (first name, last name, phone, email, DOB, service, member status). Sets status to `pending`. Associates with church via `church_id` (passed from frontend, looked up by slug). Triggers new-signup notification stub.
  - `PUT /api/me` — updates user profile fields
- `server/routes/checkins.ts`:
  - `GET /api/checkins` — returns current user's check-in history (all months)
  - `GET /api/checkins/:month` — returns specific month's check-in
  - `POST /api/checkins` — submits a check-in. Validates with Zod schema. Enforces unique (user_id, month). If any score is 5 and no testimony provided for that category, return 400. If any score is 0 or 1, create an outreach_event and trigger notification stub.
- `server/routes/admin.ts`:
  - `GET /api/admin/pending` — list users with status=pending (wrangler+)
  - `POST /api/admin/pending/:userId/approve` — set user status to active, trigger approval notification stub (wrangler+)
  - `GET /api/admin/users` — list all users in church (leader)
  - `PUT /api/admin/users/:id/role` — change user role (leader)
  - `GET /api/admin/reports/completion` — check-in completion for current month: list of users with whether they've submitted (leader)
  - `GET /api/admin/reports/trends` — aggregate average scores per category per month for the church (leader)
  - `GET /api/admin/reports/user/:id` — individual user's scores over time (leader)
  - `GET /api/admin/outreach` — list open outreach events (wrangler+)
  - `PUT /api/admin/outreach/:id` — update outreach event status (wrangler+)
- `server/routes/webhooks.ts` — placeholder POST routes for `/api/webhooks/clerk`, `/api/webhooks/twilio`, `/api/webhooks/postmark` — just log the request body and return 200.
- `server/services/sms.ts` — `sendSMS(to: string, body: string): Promise<{ success: boolean, sid: string }>` — logs to console, returns `{ success: true, sid: 'stub-' + Date.now() }`
- `server/services/email.ts` — `sendEmail(to: string, subject: string, htmlBody: string): Promise<{ success: boolean, messageId: string }>` — logs to console, returns `{ success: true, messageId: 'stub-' + Date.now() }`
- `server/services/notifications.ts` — orchestration:
  - `notifyNewSignup(user)` — calls sms stub to notify a wrangler, logs to notification_log
  - `notifyOutreach(outreachEvent)` — calls sms stub to notify assigned wrangler, logs to notification_log
  - `notifyEmergency(outreachEvent)` — calls sms stub to ALL wranglers + leaders, logs to notification_log
  - `sendCheckinReminder(user)` — calls sms stub with check-in link, logs to notification_log
- `server/services/scheduler.ts` — exports `triggerMonthlyReminders(churchId)` and `triggerFollowUpReminders(churchId)` functions that query for users who haven't checked in and call notification stubs. Does NOT actually schedule anything — these are functions that can be called manually or by a future cron.

### Stream D: TanStack Start Frontend

Create the TanStack Start app. Depends on Stream B (shared types/schemas).

**Files to create:**
- `app.config.ts` — TanStack Start / Vinxi config. Set up `/api` proxy to `http://localhost:4301` in dev.
- `app/client.tsx` — TanStack Start client entry (standard boilerplate)
- `app/router.tsx` — TanStack Router config with QueryClient integration
- `app/ssr.tsx` — SSR entry with `clerkMiddleware()` (see Clerk Setup above)
- `app/routes/__root.tsx` — Root layout: `<ClerkProvider>`, `<QueryClientProvider>`, head meta (title: "Culture of Manhood"), Inter font, Tailwind CSS import. Shell component renders `<html>`, `<head>`, `<body>`.
- `app/routes/index.tsx` — Home: if signed in, redirect to `/dashboard`. If signed out, show a simple welcome screen with `<SignInButton>`.
- `app/routes/join.$slug.tsx` — Church-specific entry: resolves church by slug (call `GET /api/churches/:slug` or embed slug in sign-up flow), stores slug in localStorage or context, shows Clerk sign-in. After auth, redirects to `/profile` for onboarding.
- `app/routes/sign-in.tsx` — Full-page Clerk sign-in component.
- `app/routes/_authed.tsx` — Layout route with `beforeLoad` that calls `auth()` server-side. If not authenticated, redirect to `/sign-in`. If authenticated, check if user has profile (call `/api/me`). If no profile, redirect to `/profile`. If profile status is `pending`, show "Your account is being reviewed — a brother will reach out soon." If `active`, render child routes.
- `app/routes/_authed/dashboard.tsx` — Dashboard: show user's check-in history (list of past months with score summaries). Prominent CTA for current month's check-in if not yet submitted. Use TanStack Query to fetch from `/api/checkins`.
- `app/routes/_authed/checkin.$month.tsx` — **THE critical page.** Mobile-first monthly check-in form:
  - 5 categories, each with a 0-5 selector (large tap targets for mobile)
  - As user selects a score, show the meaning label below (e.g., "Steady", "Could use a phone call")
  - Color coding: 0=red, 1=orange, 2=yellow, 3=neutral, 4=green, 5=blue/gold
  - When 5 is selected: smoothly expand a textarea below that category for testimony
  - Submit button at bottom
  - On success with any 5: show encouragement ("This is worth sharing. Consider calling a brother.")
  - On success with any 1: show comfort ("We've let someone know. A brother will reach out.")
  - On success with any 0: show comfort with urgency tone
  - On success with all 2-4: simple confirmation ("Thanks for checking in this month.")
  - Use TanStack Form + shared Zod schema for validation
  - SSR this route for fast load from SMS links
- `app/routes/_authed/profile.tsx` — Profile form: first name, last name, phone, email, date of birth, service attended, church member checkbox. On first visit (no existing profile), this is onboarding. On return visits, this is editing. Use TanStack Form + shared Zod schema.
- `app/routes/_authed/_admin.tsx` — Admin layout: check user role from `/api/me`. If not wrangler or leader, show "Access denied." Otherwise render child routes with admin navigation sidebar/tabs.
- `app/routes/_authed/_admin/index.tsx` — Admin dashboard: summary cards (pending approvals count, check-in completion % this month, open outreach events count).
- `app/routes/_authed/_admin/pending.tsx` — Pending approvals: table of pending users with name, email, phone, sign-up date. "Approve" button on each row.
- `app/routes/_authed/_admin/users.tsx` — User management: table of all users with name, role, status, last check-in. Role change dropdown (leader only).
- `app/routes/_authed/_admin/reports.tsx` — Reports: completion rate table/chart for current month. Trend lines per category over time. Click a user name to see their individual history.
- `app/routes/_authed/_admin/outreach.tsx` — Outreach management: table of open outreach events with man's name, category, score, assigned wrangler, status. Buttons to update status.
- `app/components/ui/` — Set up shadcn/ui: button, card, input, label, select, textarea, badge, table, tabs. Use `bunx shadcn@latest init` and `bunx shadcn@latest add <component>`.
- `app/components/checkin-form.tsx` — Reusable check-in form component with all the scoring logic.
- `app/components/score-badge.tsx` — Score display: colored badge with label.
- `app/lib/api.ts` — Typed fetch wrapper: `api.get<T>(path)`, `api.post<T>(path, body)`, `api.put<T>(path, body)`. Includes Clerk token in Authorization header. Base URL is `/api` (proxied to Fastify).
- `app/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge).
- `app/hooks/use-api.ts` — TanStack Query hooks: `useMe()`, `useCheckins()`, `useCheckin(month)`, `useAdminUsers()`, `useAdminPending()`, `useAdminReports()`, `useAdminOutreach()`, plus mutation hooks for submissions.
- `app/styles/app.css` — Tailwind 4 import + any global styles.

### Stream E: Dev Tooling + Integration

Wire everything together. Depends on all other streams.

**Files to create:**
- `dev.ts` — Orchestrator script:
  1. Check if Docker is running, start if not (macOS: `open -a Docker`)
  2. Run `docker compose up -d` for PostgreSQL
  3. Wait for Postgres to accept connections (retry loop)
  4. Run migrations: `bunx drizzle-kit migrate`
  5. Start Fastify: `bun server/index.ts` (background)
  6. Start TanStack Start: `bunx vinxi dev` (foreground, shows logs)
  7. Handle SIGINT: kill both servers, stop Docker
- `package.json`:
  - name: `cultureofmanhood-app`
  - scripts: `dev` (bun dev.ts), `build`, `start`, `db:generate` (bunx drizzle-kit generate), `db:migrate` (bunx drizzle-kit migrate), `db:seed` (bun db/seed.ts), `db:studio` (bunx drizzle-kit studio), `lint` (bunx biome check .), `lint:fix` (bunx biome check --write .)
  - Dependencies: react, react-dom, @tanstack/react-start, @tanstack/react-router, @tanstack/react-query, @clerk/tanstack-react-start, fastify, @fastify/cors, fastify-type-provider-zod, zod, drizzle-orm, postgres, tailwindcss, class-variance-authority, clsx, tailwind-merge, lucide-react, @radix-ui/react-slot, recharts
  - devDependencies: @types/react, @types/react-dom, @types/bun, @biomejs/biome, drizzle-kit, husky, lint-staged, typescript, vinxi
- `tsconfig.json` — strict mode, paths for `~/` → `app/` and `@shared/` → `shared/` and `@db/` → `db/` and `@server/` → `server/`
- `biome.json` — indent: space/2, line width: 100, single quotes, semicolons always
- `.env.example`:
  ```
  # Database
  DATABASE_URL=postgresql://app_user:dev_password@localhost:4601/cultureofmanhood_dev

  # Clerk
  CLERK_PUBLISHABLE_KEY=pk_test_...
  CLERK_SECRET_KEY=sk_test_...

  # Twilio (stub for now)
  TWILIO_ACCOUNT_SID=stub
  TWILIO_AUTH_TOKEN=stub
  TWILIO_PHONE_NUMBER=+15555555555

  # Postmark (stub for now)
  POSTMARK_API_KEY=stub
  POSTMARK_FROM_EMAIL=noreply@cultureofmanhood.com

  # App
  APP_URL=http://localhost:4001
  API_PORT=4301
  NODE_ENV=development
  ```
- `.env` — same as .env.example but with real Clerk keys:
  ```
  CLERK_PUBLISHABLE_KEY=pk_test_c3R1bm5pbmctamF5LTcwLmNsZXJrLmFjY291bnRzLmRldiQ
  CLERK_SECRET_KEY=sk_test_WUNI1itfukj0V2M98SDm0nmFDtcdyfMO35SncuZzea
  ```
- `.gitignore` — node_modules, dist, .output, .vinxi, **/.env*, !**/.env.example, *.db, .DS_Store
- `fly.toml` — app name `cultureofmanhood-app`, primary region `ord` (Chicago — closest to Michigan)
- `Dockerfile` — multi-stage: install deps with bun, build TanStack Start, copy server, run both in production
- Initialize git repo, create initial commit

---

## Definition of Done

After all streams complete, verify:

- [ ] `bun run dev` starts Docker (Postgres on 4601), Fastify (4301), TanStack Start (4001)
- [ ] `http://localhost:4001` shows app home (sign-in prompt or redirect)
- [ ] `http://localhost:4001/api/health` returns `{ status: "ok" }` (proxied to Fastify)
- [ ] Clerk sign-in works with Google OAuth
- [ ] After sign-in, redirected to `/profile` for onboarding
- [ ] Profile form submits to `/api/me`, user created with `status: pending`
- [ ] Console shows stub SMS notification for new sign-up
- [ ] `/admin/pending` shows the pending user (when accessed by a leader)
- [ ] Approving a user sets status to active
- [ ] `/checkin/2026-03` (or current month) renders the check-in form
- [ ] Submitting a check-in with score 5 captures testimony
- [ ] Submitting with score 1 creates outreach event, console shows stub SMS
- [ ] `/dashboard` shows check-in history
- [ ] `/admin/reports` shows completion data
- [ ] No TypeScript errors
- [ ] Biome passes: `bun run lint`
- [ ] Database has all 5 tables with correct schema
