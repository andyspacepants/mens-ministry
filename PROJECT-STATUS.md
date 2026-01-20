# Men's Ministry Project Status

**Last Updated**: 2026-01-20
**Current Phase**: React app built, desktop layout complete, ready for mobile + deployment

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

## What's Built (v1.0)

### Landing Page Features
- ✅ Hero section with scroll-snap navigation
- ✅ Interactive pyramid (click to see value details)
- ✅ Auto-highlights next upcoming value based on current date
- ✅ Quote section
- ✅ Schedule timeline with dynamic "NEXT UP" badge
- ✅ Responsive pyramid sizing (800px → 640px → smaller on mobile)

### Tech Stack
- **Runtime**: Bun 1.3.6
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + custom CSS
- **Components**: shadcn/ui (available but not heavily used yet)
- **Port**: 5003

### File Structure
```
mens-ministry/
├── src/
│   ├── App.tsx                 # Main landing page
│   ├── index.ts                # Bun server (port 5003)
│   ├── index.css               # Custom styles (pyramid, timeline)
│   ├── frontend.tsx            # React entry
│   ├── index.html
│   └── components/ui/          # shadcn components
├── docs/
│   ├── 2026/                   # Vision, schedule, cadence docs
│   └── site-brainstorm/        # Original HTML mockups (v1-v4.1)
├── styles/globals.css
├── package.json
└── PROJECT-STATUS.md
```

---

## 2026 Schedule

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

## Next Steps

### 1. Mobile View (Priority)
Most users will access via QR code on their phone. Need to:
- [ ] Test current responsive behavior on actual devices
- [ ] Optimize pyramid for mobile (may need different layout)
- [ ] Ensure scroll-snap works well on mobile
- [ ] Test touch interactions on pyramid blocks
- [ ] Consider mobile-first header/nav if needed

### 2. ICS Calendar Generation
- [ ] Create ICS file generator for individual events
- [ ] Create "Add All" ICS with full year schedule
- [ ] Make event details (location, time, description) easy to update
- [ ] Consider: Store event metadata in a separate data file for easy editing

**Event Details Needed**:
- Location (TBD - church address?)
- Time (TBD - morning? evening?)
- Description per event

### 3. Deployment
Need to set up production hosting:

**Domain**:
- [ ] Purchase `cultureofmanhood.com` (Porkbun)
- [ ] Or use subdomain pattern: `men.journeylifechurch.com`?

**Hosting Options**:
| Option | Pros | Cons |
|--------|------|------|
| **Fly.io** | Already have account, good for Bun apps, easy SSL | Monthly cost if always-on |
| **Cloudflare Pages** | Free, fast CDN, easy DNS if domain on CF | Static only (no server routes) |
| **Cloudflare Workers** | Can run Bun-like code, free tier | Different deployment model |

**Recommended Stack**:
- Domain: Porkbun or Cloudflare Registrar
- DNS: Cloudflare (free)
- Hosting: Fly.io (since we have API routes and will add more backend later)
- SSL: Automatic via Fly.io

**Questions to Answer**:
- Do we need the Bun server routes, or could this be static?
- If static, Cloudflare Pages is simpler and free
- If we need server (ICS generation, future surveys), Fly.io makes sense

---

## Future Features (Post-Launch)

### Near-term
- [ ] ICS calendar downloads working
- [ ] QR code for easy mobile access
- [ ] Basic analytics (who's visiting?)

### Medium-term
- [ ] Survey system for monthly value tracking
- [ ] Email/SMS reminders via Postmark
- [ ] Admin page to update schedule/content

### Long-term
- [ ] Data visualization for Sunday projector
- [ ] Multi-tenant support (`{church}.cultureofmanhood.com`)
- [ ] Shared resources across churches

---

## Design Decisions

### Visual Style
- **Colors**: Black background (#000), Blue accent (#3b82f6) - JLC brand
- **Font**: Inter (Google Fonts)
- **Layout**: Scroll-snap sections, full viewport height

### Pyramid Sizing
- Desktop: 800px base width
- Tablet: 640px base width
- Mobile: 340px base width (descriptions hidden)

### Dynamic Highlighting
- Pyramid auto-selects next upcoming VALUE (skips Kickoff)
- Schedule shows "NEXT UP" on next chronological EVENT
- Both computed from current date at page load

---

## Key Content

### Hero
```
Men's Ministry 2026
We're building a culture, not a crowd.
Being a man isn't once a month—it's every day, all the time.
This is where we sharpen what that means, together.
```

### Quote
```
"We want to live these values so wholeheartedly that when people
interact with us—at home, at Journey, at work, in our community—
they experience them."
```

---

## Running Locally

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Open http://localhost:5003
```

---

## Contact

- **Ministry Leader**: Andrew Bailey
- **Church**: Journey Life Church
- **Company**: Avodah
