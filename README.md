# Iron Oaks · Concept Site

Live concept build of the Iron Oaks website for Edward's meeting. Real navigation, real order flow, real "are we open?" indicator, and a working Truck Dashboard he can demo from a phone.

This is a **concept**, not the final production site — payments aren't real, photos are placeholders, and a few names are still TBD. Everything else is wired up so the meeting can be hands-on instead of a stack of mockups.

---

## How to run it

From this folder, in a terminal:

```
npm install
npm run dev
```

Then open **http://localhost:3000** in a browser. Press `Ctrl+C` in the terminal to stop.

If you want Edward to see it on his phone over the same Wi-Fi:

```
npm run dev -- -H 0.0.0.0
```

Then find your laptop's IP (System Settings → Network) and have him open `http://YOUR-IP:3000` on his phone. Same network only.

---

## What's where

| Page | URL | What it does |
|---|---|---|
| Home | `/` | Hero, today's open status, signature menu, community block |
| Menu | `/menu` | The two signature potatoes + the coming-soon third. Tap "Add" to test the order flow. |
| Order | `/order` | Cart, pickup or delivery, ZIP validation, mock checkout |
| Order success | `/order/success` | Confirmation page with the tipping reminder |
| Calendar | `/calendar` | Three weeks of open/closed/catering days. Catering days show the client's name. |
| Catering | `/catering` | Slide the headcount up — under 60 shows bundle pricing, over 60 switches to the hybrid form + Calendly placeholder |
| About | `/about` | Edward's bio + the assistant's placeholder bio |
| Community | `/community` | Host business shoutout + community partner blocks |
| **Truck Dashboard** | `/dashboard` | The killer demo — see below |

---

## The Truck Dashboard

This is the piece Edward needs to see most. It's at `/dashboard`.

**Demo password:** `ironoaks`

What it does (all from a phone, all in seconds):

- **Mark sold out for today** — one big red button at the top. Hits it, the home page, menu, and every other page immediately show "Sold out for today" and the "Add to cart" buttons disappear. Hit it again to re-open and reset inventory to the day's max.
- **Adjust today's count** — set the starting portion count (e.g. 20 for normal, 40 for a busy Saturday). The number on the front of the site updates: "14 of 20 portions left."
- **Free delivery banner toggle** — flip the orange banner at the top of every page on or off.
- **Catering & closure calendar** — add a date, pick "catering" or "closed," add the client name if catering. That date now shows on the public calendar with the client visible.

To prove the "10 seconds to mark sold out" promise: pull up the dashboard on a phone, sign in, tap the big red button. Then refresh the home page on another device — the site has flipped.

---

## State & how the site updates

Everything Edward toggles in the dashboard is saved to a single file at:

```
data/site-state.json
```

The site reads this file on every page load. So **changes show up as soon as the page refreshes** anywhere. Edward changes inventory at noon, customer refreshes at 12:01, they see the new count.

To reset everything to the starting demo state, just edit that file (or restore it from git).

When this goes to production, this same data lives in Sanity instead of a JSON file — the dashboard works the same way from Edward's perspective.

---

## What's real vs. placeholder

**Real (wired up and working):**
- Dark/charcoal palette, typography, layout
- "Are we open?" logic — derived from hours, inventory, and calendar entries
- Cart and order flow, including ZIP validation, tax math, the tipping reminder
- Truck Dashboard — sign-in, inventory toggle, banner toggle, calendar editor
- Mobile-first layout with sticky top + bottom nav
- Calendar page reading from the same source as the dashboard
- "Built by Meridian Works" footer credit + link

**Placeholder (Edward / I will swap before launch):**
- Food photos (Unsplash for now — real shots coming from Edward)
- Logo — none yet, just the "Iron Oaks" wordmark in serif
- Bios for Edward + the assistant — placeholder text, real ones coming
- Assistant's name — needs confirming
- Host business name — needs confirming
- Community partner names — Edward picks real partners
- Delivery ZIP list — 15 central Austin ZIPs as a placeholder (Edward sends the real map)
- Phone + email in the footer — placeholder
- Stripe — no real payment, the "Place order" button just shows a success page
- Email/SMS notifications — none yet (will route to Edward's orders Gmail when he sets it up)
- Calendly embed on the 60+ catering flow — placeholder block where the real embed will go

---

## Folder map (if you need to peek inside)

```
src/
  app/                  the actual pages
    page.tsx            home
    menu/page.tsx
    order/page.tsx
    order/success/page.tsx
    calendar/page.tsx
    catering/page.tsx
    about/page.tsx
    community/page.tsx
    dashboard/page.tsx
    api/state/route.ts  the endpoint the dashboard writes to
    layout.tsx          wraps every page with header/footer/nav
    globals.css         the dark palette + typography
  components/           layout shell + reusable bits
  content/              text content (menu items, bios, settings)
  lib/                  cart logic, state read/write
  types/                shared types
data/
  site-state.json       what the dashboard edits
archive/
  decisions-deck-v1.html
  responses-v1.html     v1 deck + response form (kept for posterity)
```

---

## Common edits without writing code

- **Change menu prices or descriptions** — `src/content/menu.ts`
- **Change brand text / contact info** — `src/content/settings.ts`
- **Edit Edward or assistant bios** — `src/content/bios.ts`
- **Edit community partners** — `src/content/spotlight.ts`
- **Change delivery ZIPs** — `src/content/zips.ts`
- **Reset the demo state** — `data/site-state.json`

All are plain-text files. Save, then refresh the page.

---

## Build / production check

To make sure nothing's broken before sharing:

```
npm run build
```

If that finishes without errors, the site is healthy.
