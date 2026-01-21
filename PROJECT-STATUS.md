# Men's Ministry Project Status

**Last Updated**: 2026-01-20
**Current Phase**: Live at https://jlc.cultureofmanhood.com

---

## Project Overview

Building a men's ministry website for Journey Life Church (JLC) with the potential to support other churches via `cultureofmanhood.com`.

### Core Vision
- Transform a "monthly small group" into a true **culture of manhood**
- **Culture** = how well we experience and express our values within our community
- Men's ministry is one tool to build this culture
- Tagline: **"We're building a culture, not a crowd."**

### The 10 Values of Manhood (Pyramid Structure)

```
                    ┌─────────────────────────┐
                    │  On Earth as in Heaven  │  ← Inheritance
                    └─────────────────────────┘
              ┌───────────┐       ┌───────────┐
              │  Growing  │       │  Fruitful │     ← Alignment
              └───────────┘       └───────────┘
      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
      │Husband │ │ Father │ │ Worker │ │ Member │   ← Leadership
      └────────┘ └────────┘ └────────┘ └────────┘
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ Intimacy │    │ Identity │    │Integrity │     ← Foundations
   └──────────┘    └──────────┘    └──────────┘
```

---

## What's Built

### Landing Page Features
- ✅ Hero section with scroll-snap navigation
- ✅ Interactive pyramid (click to see value details) - desktop
- ✅ Categorized values list for mobile (Foundations → Leadership → Alignment → Inheritance)
- ✅ Auto-highlights next upcoming value based on current date
- ✅ Quote section
- ✅ Schedule timeline with dynamic "NEXT UP" badge
- ✅ ICS calendar downloads (single event, remaining events, all events)
- ✅ Social share image (og:image) for link previews

### Infrastructure
- ✅ GitHub repo: `andyspacepants/mens-ministry`
- ✅ CI/CD: GitHub Actions deploys to Fly.io on merge to main
- ✅ Custom domain: `jlc.cultureofmanhood.com` (SSL via Fly.io)
- ✅ Admin page with PIN authentication (for future use)

### Tech Stack
- **Runtime**: Bun 1.3.6
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + custom CSS
- **Components**: shadcn/ui (available but not heavily used yet)
- **Hosting**: Fly.io
- **Domain**: Porkbun (cultureofmanhood.com)

### File Structure
```
mens-ministry/
├── src/
│   ├── App.tsx                 # Main landing page
│   ├── index.ts                # Bun server (API routes + static serving)
│   ├── index.css               # Custom styles (pyramid, timeline, mobile)
│   ├── frontend.tsx            # React entry
│   ├── index.html              # HTML template with OG meta tags
│   ├── data/
│   │   └── schedule.ts         # Shared schedule data
│   ├── lib/
│   │   ├── ics.ts              # ICS calendar generation
│   │   └── auth.ts             # Admin PIN authentication
│   └── components/
│       ├── ui/                 # shadcn components
│       └── admin/              # Admin page components
├── public/
│   └── og-image.svg            # Social share image
├── docs/
│   └── 2026/                   # Vision, schedule, cadence docs
├── .github/
│   └── workflows/
│       └── fly-deploy.yml      # CI/CD workflow
├── fly.toml                    # Fly.io config
└── PROJECT-STATUS.md
```

---

## 2026 Schedule

**Location**: 2289 Cedar St. Holt, MI 48842
**Time**: 9:00 AM - 11:00 AM Eastern

**Pattern**: Third Saturday of each month, EXCEPT June/Nov/Dec (Second Saturday)

| Month | Date | Theme | Category |
|-------|------|-------|----------|
| February | 21 | Vision & Invitation | Kickoff |
| March | 21 | Intimacy | Foundations |
| April | 18 | Identity | Foundations |
| May | 16 | Integrity | Foundations |
| June | **13** | Husband | Leadership |
| July | 18 | Father | Leadership |
| August | 15 | Worker | Leadership |
| September | 19 | Member | Leadership |
| October | 17 | Growing | Alignment |
| November | **14** | Fruitful | Alignment |
| December | **12** | On Earth as in Heaven | Inheritance |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/calendar/:index` | GET | Download ICS for single event |
| `/api/calendar/remaining` | GET | Download ICS for remaining events |
| `/api/calendar/all` | GET | Download ICS for all events |
| `/api/admin/verify` | POST | Verify admin PIN |

---

## Remaining Tasks

### Copy Review
- [ ] Review and finalize all landing page copy
- [ ] Value descriptions (shown on pyramid click)
- [ ] Hero section messaging

### Future Features
- [ ] Survey system for monthly value tracking
- [ ] Email/SMS reminders
- [ ] Data visualization for Sunday projector
- [ ] Multi-tenant support (`{church}.cultureofmanhood.com`)

---

## Running Locally

```bash
# Install dependencies
bun install

# Start dev server (with HMR)
bun dev

# Build for production
bun run build

# Open http://localhost:5003
```

---

## Deployment

Automatic on merge to `main`:
1. Push to GitHub
2. GitHub Actions triggers
3. Fly.io deploys new version

Manual deploy:
```bash
fly deploy
```

---

## Secrets/Config

**Fly.io Secrets**:
- `ADMIN_PIN` - PIN for admin page access

---

## Contact

- **Ministry Leader**: Andrew Bailey
- **Church**: Journey Life Church
- **Company**: Avodah
