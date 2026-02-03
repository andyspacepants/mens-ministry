---
name: mantimes
description: Scaffold a new Man Times newsletter issue
user_invocable: true
---

# Man Times — New Issue Skill

You are scaffolding a new issue of **Man Times**, the print newsletter for the men's ministry at Journey Life Church.

## Step 1: Gather Context

Read these files to understand the ministry's values, direction, and tone:

1. `src/data/schedule.ts` — get the full schedule and use `getNextEventIndex()` logic to determine the next upcoming meeting (date, title, description, category, valueId)
2. `docs/blueprint.md` — the foundational philosophy: definition of manhood, three levels of invitation, how culture is built
3. `docs/standards-review.md` — personal reflections on each value (intimacy, identity, integrity, leadership, fruitfulness, trials, inheritance) with scripture and key insights
4. `docs/2026/vision.md` — the 2026 vision, goals, tagline ("We're building a culture, not a crowd"), the 10 values of manhood, and leadership model
5. The most recent previous issue in `print/mantimes/` (e.g., `v1-i1-2026.02.html`) — for reference on tone, structure, and formatting

From the schedule data, determine:
- **Month and year** of the next issue
- **Event date** (day of month)
- **Title and description** of the month's topic
- **Category** (Kickoff, Foundations, Leadership, Alignment, Inheritance)
- **valueId** — use this to find the corresponding section in `docs/standards-review.md` for deeper context on the month's value

## Step 2: Scaffold the File

1. Determine the issue number by counting existing `v1-i*` files in `print/mantimes/`
2. Copy `print/mantimes/_template.html` to `print/mantimes/v1-iN-YYYY.MM.html` (e.g., `v1-i2-2026.03.html`)
3. Fill in the masthead placeholders:
   - `<!-- MONTH YEAR -->` → e.g., `March 2026`
   - `<!-- VOLUME · ISSUE -->` → e.g., `Volume 1 &middot; Issue 2`
   - Update the `<title>` tag
4. Copy the back page markup from `print/mantimes/_back-page.html` into the back page section
5. Move the `<div class="next-label">Up Next</div>` to the correct month's row in the schedule table

## Step 3: Discuss Front Page Content

Now start a conversation with the user about the front page. Use what you learned from the docs to inform the discussion. Reference specific insights from the blueprint and standards review that relate to this month's value.

Ask about:
- **Theme/angle**: Based on the month's value (e.g., "Intimacy" — what aspect do you want to highlight? The breathing/food/water metaphor from the standards review? The distinction between religious discipline and identity-driven consistency?)
- **Main content section**: The February issue used reflective questions. What format works for this month? Options include:
  - Reflective questions (like Issue 1)
  - A short article or meditation
  - Scripture highlights with commentary
  - A mix of formats
- **Writeup**: What's the key message or CTA? What do you want men to walk away thinking about?
- **Footer CTA**: What's the invitation line and tone?

When discussing, draw on the specific language and themes from the docs. For example, if the month is "Intimacy," reference the three aspects of connection (breathing, food, water/wine), the John 15 "abide in me" thread, and the key insight about consistency vs. religion.

## Step 4: Build the Front Page

Once the user has given direction, fill in the front page content:
- Main content area (questions, article, etc.)
- Writeup section with label, headline, and body paragraphs
- Footer with CTA text and event details (date, time from schedule, location from `EVENT_LOCATION`)

## Formatting Notes

- Use `&amp;` for `&`, `&mdash;` for em-dashes, `&ndash;` for en-dashes, `&middot;` for middle dots
- Event time is always `9:00 &ndash; 11:00 AM`
- Location is always `2289 Cedar St. Holt, MI`
- Blue accent color is `#3b82f6`
- Questions use `.al` (left), `.ar` (right), `.ac` (center) alignment classes, alternating for visual rhythm
- Bold/highlight words in questions use `<em>` tags (styled blue+bold by CSS)
