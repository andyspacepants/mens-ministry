# Culture of Manhood App

## What This Is

A proactive engagement platform for men's ministry communities. Not a passive contact list — a system that uses technology to remind, nudge, and connect men between monthly Saturday gatherings.

**Origin:** At the February 21, 2026 kickoff meeting, one of the guys asked, "Why don't I have everybody's phone number?" The room agreed they wanted connection. But a passive list rarely drives action. This app is the answer: proactive, monthly check-ins that surface how men are actually doing and trigger real human connection when it matters most.

**Tagline context:** "Men's ministry isn't what happens on Saturday — it's what is amplified because we meet on Saturday."

---

## Core Concept

Once a month, every enrolled man receives a text message (with email fallback) containing a link to a short check-in form. Five questions, scored 0–5, covering the areas of life that matter:

1. **Connection with the Lord** (Intimacy)
2. **Relationship with your spouse** (Husband)
3. **Relationship with your kids** (Father)
4. **How you're doing at work** (Worker)
5. **Personal care** (Member/Self)

The scoring system has built-in responses:

| Score | Meaning | System Response |
|-------|---------|-----------------|
| **5** | "It's so good I have a story to tell" | Opens a testimony field. Follow-up encouragement: "You should share this — call someone, tell your group." |
| **4** | "Going really well" | No follow-up. Data captured. |
| **3** | "Steady" | No follow-up. Data captured. |
| **2** | "It's been a rough month" | No follow-up. Data captured. |
| **1** | "Could use a phone call" | Shows a list of available wranglers. System sends a text to a wrangler: "Hey, someone could use a call. Can you reach out?" |
| **0** | "This is an emergency" | Immediate outreach. Notifies leadership + wranglers with urgency. |

---

## Two-Project Architecture

The platform is split into two separate projects:

### 1. Church Landing Pages (this repo: `mens-ministry`)
- Each church gets a landing page at `{slug}.cultureofmanhood.com` (e.g., `jlc.cultureofmanhood.com`)
- Static/simple — schedule, values, newsletter. No auth, no database.
- JLC's is already live and stays as-is
- The only change: add a "Sign In" link to the header → `app.cultureofmanhood.com/join/{slug}`

### 2. The App (separate repo: `cultureofmanhood-app`)
- Lives at `app.cultureofmanhood.com` — one deployment, all churches
- TanStack Start (frontend SSR) + Fastify (API server) + PostgreSQL
- A man's church is stored in their user record, not derived from the URL
- Entry points:
  - From landing page: `app.cultureofmanhood.com/join/jlc` → sign in → associate with JLC
  - From SMS link: `app.cultureofmanhood.com/checkin/2026-03` → church comes from their profile
  - Direct: `app.cultureofmanhood.com` → dashboard (already knows their church)

### Multi-Tenancy (Simple)
- `church_id` foreign key on every table — that's the tenant boundary
- Every query filters by the user's `church_id`
- No subdomain routing on the app — the app is always `app.cultureofmanhood.com`
- Church context is set at sign-up (via `/join/:slug`) and stored in the user record
- Each church has its own users, wranglers, leaders, and data
- Andrew manually creates new churches for now (no self-serve onboarding UI in v1)

---

## User Roles

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Man** | A regular enrolled member | Fill out monthly check-ins, view own history, update profile |
| **Wrangler** (Champion) | A man who has volunteered to do outreach | Everything a Man can do + receives outreach notifications when someone scores 0 or 1 + approves new sign-ups |
| **Leader** (Admin) | Ministry leadership | Everything a Wrangler can do + view reports/dashboards on all men + manage wranglers + manage church settings |

---

## User Flows

### Sign-Up Flow

1. Man visits `jlc.cultureofmanhood.com` and clicks "Join" (or similar CTA)
2. Authenticates via Google (Clerk) — creates auth account
3. Fills out profile: first name, last name, phone number, email, date of birth, which service they attend, whether they're a member at JLC
4. **Account is NOT immediately active.** A wrangler receives a notification (text or email): "New sign-up: [Name]. Approve or reach out?"
5. Wrangler approves → Man is now enrolled and will receive monthly check-ins
6. If wrangler wants to reach out first, they can — the system gives them the man's phone number

### Monthly Check-In Flow

1. System sends a text message to all enrolled men with a link to that month's check-in form
2. If no response within [configurable] days, system sends an email as follow-up
3. Man clicks link → lands on a simple, mobile-first form (authenticated via Clerk, but the link should feel lightweight — not a full app login)
4. Man answers 5 questions (0–5 scale for each)
5. **If any answer is 5:** Testimony text field opens. After submission, man sees encouragement: "This is worth sharing. Consider calling someone to tell them."
6. **If any answer is 1:** After submission, man sees: "We've let someone know. A brother will be reaching out." System texts an available wrangler.
7. **If any answer is 0:** Immediate notification to leadership + wranglers with urgency flag.
8. Man sees a simple confirmation: "Thanks for checking in this month."

### Wrangler Notification Flow

1. Wrangler receives a text: "Hey [wrangler name], [man's first name] could use a phone call this month. His number is [phone]. Can you reach out?"
2. For emergencies (score 0): "URGENT: [man's first name] marked an emergency on his check-in. Please reach out now: [phone]."
3. For new sign-ups: "[Name] just signed up for Culture of Manhood. Approve them or reach out? [link to approve]"

### Admin/Leader Dashboard

- View all men in the church
- View check-in completion rates (who filled it out this month, who didn't)
- View aggregate scores (how is the church trending across the 5 categories?)
- View individual history (how is a specific man trending month over month?)
- Manage wranglers (promote/demote)
- Manage church settings
- View and act on pending sign-ups

---

## Data Model

### Tables

```
church
├── id (uuid, pk)
├── name (text) — "Journey Life Church"
├── slug (text, unique) — "jlc"
├── created_at (timestamp)
└── updated_at (timestamp)

user (managed by Clerk, but we store profile data)
├── id (uuid, pk)
├── clerk_id (text, unique) — links to Clerk user
├── church_id (uuid, fk → church.id)
├── role (enum: man, wrangler, leader)
├── status (enum: pending, active, inactive)
├── first_name (text)
├── last_name (text)
├── email (text)
├── phone (text) — for SMS
├── date_of_birth (date)
├── service_attended (text) — e.g., "9:00 AM", "11:00 AM"
├── is_church_member (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

checkin
├── id (uuid, pk)
├── user_id (uuid, fk → user.id)
├── church_id (uuid, fk → church.id)
├── month (date) — first of the month, e.g., 2026-03-01
├── lord_score (int, 0-5) — Connection with the Lord
├── spouse_score (int, 0-5) — Relationship with spouse
├── kids_score (int, 0-5) — Relationship with kids
├── work_score (int, 0-5) — How you're doing at work
├── personal_score (int, 0-5) — Personal care
├── testimonies (jsonb) — array of { category: string, text: string } for any 5-rated areas
├── created_at (timestamp)
└── updated_at (timestamp)

notification_log
├── id (uuid, pk)
├── church_id (uuid, fk → church.id)
├── recipient_user_id (uuid, fk → user.id)
├── type (enum: checkin_reminder, checkin_followup, outreach_request, emergency, new_signup, approval)
├── channel (enum: sms, email)
├── status (enum: queued, sent, delivered, failed)
├── metadata (jsonb) — provider message IDs, error details, etc.
├── created_at (timestamp)
└── sent_at (timestamp)

outreach_event
├── id (uuid, pk)
├── church_id (uuid, fk → church.id)
├── checkin_id (uuid, fk → checkin.id)
├── requesting_user_id (uuid, fk → user.id) — the man who scored low
├── wrangler_user_id (uuid, fk → user.id) — the wrangler assigned
├── category (text) — which category triggered it
├── score (int) — 0 or 1
├── status (enum: pending, notified, acknowledged, completed)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### Notes on Schema

- **`church_id` on every table** — this is the multi-tenancy key. Every query filters by church.
- **`user` is separate from Clerk's user** — Clerk handles auth (Google sign-in, session management). Our `user` table holds ministry-specific profile data linked via `clerk_id`.
- **`checkin` has one row per user per month** — unique constraint on `(user_id, month)`.
- **`testimonies` as JSONB** — flexible, keeps the checkin table clean. Only populated when a score of 5 is given.
- **`notification_log`** — audit trail for every text/email sent. Important for debugging and for not double-sending.
- **`outreach_event`** — tracks the lifecycle of a wrangler reaching out to someone.

---

## Technical Architecture

### Decision Summary (per project-starter framework)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture** | Separate project (`cultureofmanhood-app`) | Clean separation from landing page, no migration risk |
| **Runtime** | Bun | Already using it, team standard |
| **Frontend** | TanStack Start + TanStack Router + TanStack Query + React 19 + Tailwind + shadcn/ui | SSR for fast check-in form loads from SMS links. Start handles all rendering and routing. |
| **Backend** | Fastify + Zod type provider | Dedicated API server for webhooks, cron, SMS/email, auth middleware, database access. Clean separation from frontend. |
| **Database** | PostgreSQL 16 + Drizzle ORM + Docker (local) | Team standard, mature pattern (12 projects) |
| **Auth** | Clerk (Google sign-in) | Multi-user social auth, proven in 3 projects |
| **Email** | Postmark (native fetch, no SDK) | Company relationship, proven in 5 projects |
| **SMS** | Twilio (to be researched/set up) | Industry standard, affordable at 20–100 users |
| **Hosting** | Fly.io | Already deployed there |
| **CI/CD** | GitHub Actions | Already configured |
| **Forms** | TanStack Form + Zod | Team standard |
| **Code Quality** | Biome + Husky + lint-staged | Team standard |

### Two-Server Architecture: TanStack Start + Fastify

This is a **new, separate project** (`cultureofmanhood-app`) at `app.cultureofmanhood.com`. The existing `mens-ministry` landing page repo stays untouched.

- **TanStack Start** — SSR, routing, rendering, forms, all user-facing UI. Runs on port `4001` (dev).
- **Fastify** — API routes, webhooks, auth middleware, database, cron jobs, SMS/email services. Runs on port `4301` (dev).
- **PostgreSQL** — data persistence via Drizzle ORM. Runs on port `4601` (dev, Docker).
- **TanStack Query** — bridges the two. Frontend fetches from Fastify API.
- **In dev:** TanStack Start's Vinxi config proxies `/api/*` requests to Fastify, so the browser only talks to one origin.
- **In production:** Same proxy pattern, or both behind a single Fly.io app with internal routing.

**Why two servers instead of server functions?**
This app has real backend complexity — inbound webhooks from Clerk, Twilio, and Postmark, a monthly cron scheduler, SMS/email orchestration with retries, and role-based middleware. These don't fit cleanly into server functions. A traditional API server is the right tool, and it's the pattern Andrew is most comfortable with.

### Clerk Integration

Auth is handled by Clerk via `@clerk/tanstack-react-start`. Setup:

- **Middleware:** `clerkMiddleware()` in TanStack Start's `createStart()` request middleware (`app/ssr.tsx`)
- **Provider:** `<ClerkProvider>` wraps the root layout's shell component (`app/routes/__root.tsx`)
- **Client-side protection:** `<SignedIn>`, `<SignedOut>`, `<SignInButton>`, `<UserButton>` components
- **Server-side protection:** `auth()` from `@clerk/tanstack-react-start/server` in route `beforeLoad` via `createServerFn`
- **API verification:** Fastify verifies Clerk session tokens on API requests (extract JWT from Authorization header, verify with Clerk backend SDK)

### Project Structure

```
cultureofmanhood-app/                # NEW REPO — app.cultureofmanhood.com
├── app.config.ts                    # TanStack Start / Vinxi config (includes /api proxy to Fastify)
├── app/
│   ├── client.tsx                   # TanStack Start client entry
│   ├── router.tsx                   # TanStack Router config
│   ├── ssr.tsx                      # TanStack Start SSR entry (clerkMiddleware here)
│   ├── routes/
│   │   ├── __root.tsx               # Root layout (ClerkProvider, QueryClient, global styles, head/meta)
│   │   ├── index.tsx                # / — app home (redirect to /dashboard if authed, or show sign-in)
│   │   ├── join.$slug.tsx           # /join/:slug — church-specific sign-up entry point
│   │   ├── sign-in.tsx              # /sign-in — Clerk sign-in page
│   │   ├── _authed.tsx              # Layout gate: requires Clerk auth, checks user profile status
│   │   ├── _authed/
│   │   │   ├── dashboard.tsx        # /dashboard — check-in history, current month CTA
│   │   │   ├── checkin.$month.tsx   # /checkin/:month — THE monthly form (mobile-first, SSR)
│   │   │   ├── profile.tsx          # /profile — edit profile / onboarding for new users
│   │   │   ├── _admin.tsx           # Layout gate: requires wrangler or leader role
│   │   │   └── _admin/
│   │   │       ├── index.tsx        # /admin — dashboard (summary cards)
│   │   │       ├── users.tsx        # /admin/users — manage users, roles
│   │   │       ├── reports.tsx      # /admin/reports — completion rates, trends
│   │   │       ├── pending.tsx      # /admin/pending — approve new sign-ups
│   │   │       └── outreach.tsx     # /admin/outreach — manage outreach events
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── checkin-form.tsx         # The 0-5 scoring form (the core UI)
│   │   ├── score-badge.tsx          # Visual score indicator with color + label
│   │   └── trend-chart.tsx          # Score trend visualization (recharts)
│   ├── hooks/
│   │   └── use-api.ts              # TanStack Query hooks for Fastify API calls
│   ├── lib/
│   │   ├── api.ts                   # Typed fetch wrapper for Fastify API
│   │   └── utils.ts                 # cn() and other utilities
│   └── styles/
│       └── app.css                  # Tailwind + global styles
├── public/                          # Static assets
│   └── favicon.svg
├── server/                          # Fastify API server
│   ├── index.ts                     # Fastify entry point (CORS, Zod type provider, route registration)
│   ├── routes/
│   │   ├── users.ts                 # GET/POST/PUT /api/me — profile CRUD
│   │   ├── checkins.ts              # GET/POST /api/checkins — check-in submission + history
│   │   ├── admin.ts                 # Admin routes: pending approvals, user management, reports
│   │   └── webhooks.ts             # Clerk, Twilio, Postmark webhook receivers
│   ├── plugins/
│   │   └── clerk.ts                 # Verify Clerk JWT from Authorization header
│   ├── middleware/
│   │   ├── auth.ts                  # Require valid Clerk session → attach userId + churchId
│   │   └── roles.ts                 # Require specific role (wrangler, leader)
│   └── services/
│       ├── sms.ts                   # STUB: logs to console, returns { success: true }
│       ├── email.ts                 # STUB: logs to console, returns { success: true }
│       ├── notifications.ts         # Orchestration: calls sms/email stubs, logs to notification_log
│       └── scheduler.ts             # STUB: exports trigger functions, no actual scheduling yet
├── db/
│   ├── index.ts                     # Drizzle + postgres client connection
│   ├── schema/
│   │   ├── church.ts
│   │   ├── user.ts
│   │   ├── checkin.ts
│   │   ├── notification-log.ts
│   │   └── outreach-event.ts
│   ├── migrations/
│   └── seed.ts                      # Seed JLC church + Andrew as leader
├── shared/
│   ├── schemas/                     # Zod schemas (used by both app/ and server/)
│   │   ├── user.ts
│   │   ├── checkin.ts
│   │   └── admin.ts
│   └── types.ts                     # Enums, score labels, role types
├── dev.ts                           # Orchestrator: Docker → Postgres → Fastify → TanStack Start
├── docker-compose.yml               # PostgreSQL 16 on port 4601
├── drizzle.config.ts
├── biome.json
├── fly.toml
├── Dockerfile
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://app_user:dev_password@localhost:4601/mens_ministry_dev

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Postmark
POSTMARK_API_KEY=...
POSTMARK_FROM_EMAIL=noreply@cultureofmanhood.com

# Twilio
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# App
APP_URL=https://jlc.cultureofmanhood.com
PORT=4301
NODE_ENV=development
```

---

## API Routes

### Public
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Landing page |
| GET | `/api/calendar/:index` | ICS download (existing) |
| GET | `/api/calendar/remaining` | ICS download (existing) |
| GET | `/api/calendar/all` | ICS download (existing) |

### Authenticated (require Clerk session)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/me` | Get current user profile |
| PUT | `/api/me` | Update current user profile |
| GET | `/api/checkins` | Get current user's check-in history |
| GET | `/api/checkins/:month` | Get specific month's check-in |
| POST | `/api/checkins` | Submit a check-in |

### Wrangler+ (require wrangler or leader role)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/pending` | List pending sign-ups |
| POST | `/api/admin/pending/:userId/approve` | Approve a sign-up |
| GET | `/api/admin/outreach` | List active outreach events |
| PUT | `/api/admin/outreach/:id` | Update outreach status |

### Leader Only (require leader role)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/users` | List all users in church |
| PUT | `/api/admin/users/:id/role` | Change user role |
| GET | `/api/admin/reports/completion` | Check-in completion rates |
| GET | `/api/admin/reports/trends` | Score trends over time |
| GET | `/api/admin/reports/user/:id` | Individual user trend |

### Webhooks
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/webhooks/clerk` | Clerk user events (sign-up, etc.) |
| POST | `/api/webhooks/twilio` | Twilio delivery status callbacks |
| POST | `/api/webhooks/postmark` | Postmark delivery/bounce callbacks |

---

## SMS Provider: Twilio

**Why Twilio:**
- Industry standard, well-documented
- At 20–100 users sending ~2 messages/month each, cost is negligible ($0.0079/SMS)
- Delivery status webhooks
- Good Bun/TypeScript support

**Implementation:**
- Use Twilio's REST API directly with fetch (no SDK needed, consistent with Postmark pattern)
- Store `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` in env
- All SMS goes through `src/services/sms.ts` — a simple function that wraps the API call
- Log every message in `notification_log`

**Monthly check-in notification sequence:**
1. On the 1st of each month (or configurable date), scheduler triggers
2. System queries all active users who haven't completed this month's check-in
3. Sends SMS: "Hey [first name], your monthly Culture of Manhood check-in is ready. Tap here to share how you're doing: [link]"
4. After [3 days], if still no check-in, sends email via Postmark as follow-up
5. After [7 days], one final SMS reminder

---

## Implementation Phases

### Phase 1: Foundation (Infrastructure + Two-Server Setup + Database)

**Goal:** Scaffold the two-server architecture, get PostgreSQL running, and verify the dev workflow.

**Tasks:**
1. Install dependencies:
   - Frontend: `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query`, `vinxi`, `tailwindcss`, `@clerk/tanstack-start`
   - Backend: `fastify`, `@fastify/cors`, `fastify-type-provider-zod`, `zod`, `@clerk/fastify`
   - Database: `drizzle-orm`, `postgres`
   - Dev: `@biomejs/biome`, `husky`, `lint-staged`, `drizzle-kit`
2. Create `docker-compose.yml` for local PostgreSQL (port 4601)
3. Create `drizzle.config.ts`
4. Create database schema files (`db/schema/*.ts`) for all 5 tables
5. Create `db/index.ts` — database connection
6. Generate and run initial migration
7. Create `db/seed.ts` — seed JLC as first church
8. Create `shared/` directory with Zod schemas and shared types
9. Scaffold TanStack Start app in `app/` — root layout, index route (landing page placeholder), `app.config.ts` with `/api` proxy to Fastify
10. Scaffold Fastify server in `server/` — entry point, health check route, Clerk plugin, tenant resolution plugin
11. Create `dev.ts` orchestrator (starts Docker → waits for Postgres → starts Fastify on 4301 → starts TanStack Start on 4001)
12. Migrate existing landing page into TanStack Start as the `/` route
13. Set up `.env.example` with all required variables
14. Set up Biome + Husky + lint-staged
15. Verify: `bun run dev` starts everything, landing page renders via SSR, Fastify health check responds, database connects

### Phase 2: Auth + User Profile + Enrollment

**Goal:** Men can sign in with Google, fill out a profile, and be approved by a wrangler before gaining access.

**Tasks:**
1. Set up Clerk project with Google OAuth provider
2. Add Clerk provider to TanStack Start root layout (`@clerk/tanstack-start`)
3. Add Clerk session verification to Fastify (`@clerk/fastify`)
4. Create authenticated layout route (`_app.tsx`) — redirects to sign-in if not authenticated
5. Build profile onboarding form (`/app/profile`) — TanStack Form + Zod: first name, last name, phone, email, DOB, service attended, member status
6. Create `POST /api/me` and `GET /api/me` and `PUT /api/me` endpoints — creates/reads/updates user with `status: pending` on first save
7. Create wrangler notification stub: when new user signs up, log it (SMS comes in Phase 4)
8. Create admin layout route (`_admin.tsx`) — gate to wrangler/leader roles only
9. Build pending approvals page (`/app/admin/pending`) — list pending users, approve button
10. Create `POST /api/admin/pending/:userId/approve` endpoint
11. On approval, update user `status: active`
12. Verify: Google sign-in → profile form → pending status → wrangler approves → active

### Phase 3: Monthly Check-In Form

**Goal:** The core product. Men fill out a beautiful, mobile-first monthly form and the scoring rules drive the right system responses.

**Tasks:**
1. Build check-in route (`/app/checkin/$month`) — SSR for fast load from SMS link
2. Create `checkin-form.tsx` component: 5 categories, each with a 0–5 slider or button group
3. Create `score-badge.tsx` component: visual indicator with color + label for each score level
4. Show score meaning as user selects (e.g., tapping 3 shows "Steady" below the selector)
5. Implement score-5 rule: when 5 is selected, smoothly expand a testimony text area below that category
6. Create `POST /api/checkins` endpoint — validates via shared Zod schema, enforces unique `(user_id, month)`, saves to DB
7. On submission with any 5: show encouragement message ("This is worth sharing. Consider calling a brother to tell them.")
8. On submission with any 1: create outreach event record, show "We've let someone know. A brother will reach out."
9. On submission with any 0: create urgent outreach event, show same message with urgency
10. Build check-in history on the `/app` dashboard — list of past months with score summaries
11. Create `GET /api/checkins` and `GET /api/checkins/:month` endpoints
12. Verify: can submit check-in, scores saved, testimonies captured, outreach events created for 0/1

### Phase 4: Notifications (SMS + Email)

**Goal:** The proactive engine. System sends texts, emails, and alerts without anyone having to remember to do it.

**Tasks:**
1. Set up Twilio account, purchase phone number, configure webhook URL
2. Create `server/services/sms.ts` — Twilio REST API via native fetch (no SDK)
3. Create `server/services/email.ts` — Postmark API via native fetch (no SDK)
4. Create `server/services/notifications.ts` — orchestration layer:
   - Decides channel (SMS first, email fallback)
   - Logs every attempt to `notification_log`
   - Handles retries on failure
5. Wire up check-in submission to trigger outreach notifications:
   - Score 1 → SMS one available wrangler with the man's name + phone
   - Score 0 → SMS all wranglers + leaders with urgency flag
6. Wire up new user sign-up to notify wranglers via SMS
7. Create `server/services/scheduler.ts` — monthly cron logic:
   - Day 1 of month (or configurable): SMS all active users who haven't checked in yet with check-in link
   - Day 4: email follow-up via Postmark to anyone who still hasn't responded
   - Day 8: final SMS reminder
8. Create `POST /api/webhooks/twilio` — delivery status callbacks, update `notification_log`
9. Create `POST /api/webhooks/postmark` — delivery/bounce callbacks, update `notification_log`
10. Decide on scheduler deployment: Fly.io scheduled machine, or internal `setInterval` with leader election, or external cron trigger
11. Verify: end-to-end flow — reminder SMS → man clicks link → fills form → scores 1 → wrangler gets SMS

### Phase 5: Admin Dashboard + Reports

**Goal:** Leaders see the full picture — who checked in, how the church is trending, and where outreach is needed.

**Tasks:**
1. Build admin dashboard index (`/app/admin`) — summary cards: check-in completion %, active outreach events, pending approvals
2. Build users page (`/app/admin/users`) — table of all enrolled men, role, status, last check-in date
3. Build role management — promote man → wrangler, wrangler → leader (and demote)
4. Create `GET /api/admin/users`, `PUT /api/admin/users/:id/role` endpoints
5. Build completion report (`/app/admin/reports`) — bar chart or table: who checked in this month, who didn't
6. Build trends report — line charts: aggregate scores across 5 categories over months (recharts or similar)
7. Build individual user detail view — click a man's name → see his score history over time
8. Create `GET /api/admin/reports/completion`, `GET /api/admin/reports/trends`, `GET /api/admin/reports/user/:id` endpoints
9. Build outreach page (`/app/admin/outreach`) — list of open events, ability to mark as acknowledged/completed
10. Create `GET /api/admin/outreach`, `PUT /api/admin/outreach/:id` endpoints
11. Polish pending approvals page (from Phase 2)
12. Verify: leader can see all data, manage roles, track outreach, view trends

### Phase 6: Polish + Deploy

**Goal:** Production-ready, deployed, real men using it.

**Tasks:**
1. Set up production PostgreSQL (Fly Postgres, CrunchyBridge, or Supabase — evaluate)
2. Create `Dockerfile` — builds both TanStack Start and Fastify, runs both in production
3. Update `fly.toml` for the new architecture
4. Update GitHub Actions CI/CD — lint, typecheck, build, migrate, deploy
5. Configure Clerk production environment + webhook endpoint
6. Configure Twilio production phone number
7. Configure Postmark production sender domain
8. DNS: `jlc.cultureofmanhood.com` serves TanStack Start (landing + app), Fastify proxied behind `/api`
9. Mobile-first responsive design pass on all app pages (check-in form is THE critical mobile experience)
10. Loading states, error states, empty states for every view
11. Rate limiting on public API routes and webhooks
12. Smoke test critical flows in production
13. Deploy, seed JLC church, create Andrew as first leader, verify end to end

---

## What's NOT in v1

These are real ideas but explicitly deferred:

- **Multi-church onboarding UI** — Andrew manually sets up new churches for now
- **Customizable questions** — the 5 categories are fixed for v1
- **In-app messaging** — outreach happens via real phone calls and texts, not in-app chat
- **Data visualization for Sunday projector** — future feature from vision doc
- **Push notifications** — SMS and email are the channels for now
- **Worship, breakfast, service project sign-ups** — manual coordination for now
- **Weekly reminders** — monthly cadence only for v1

---

## References

- [Blueprint](/docs/blueprint.md) — Ministry philosophy and values framework
- [2026 Vision](/docs/2026/vision.md) — Goals and leadership model
- [2026 Schedule](/docs/2026/schedule.md) — Meeting dates and themes
- [Meeting 1 Notes](/docs/2026/meetings/2026-02-21-vision-and-invitation.md) — Where this concept was first presented
- [Project Status](/PROJECT-STATUS.md) — Current state of the landing page
- [Project Starter](~/dev/project-starter/) — Templates and decision framework
- [Project Enablers](~/dev/project-enablers/) — MCPs, APIs, CLIs, patterns
