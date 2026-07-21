# Edward's Food Truck — TODO

## 🔗 Live links — share these with Edward

| What | URL | Notes |
|------|-----|-------|
| **🍴 Public site** | **https://edward-food-truck.vercel.app** | The customer-facing site — menu, ordering, hours, "are we open?" status. |
| **🎛️ Truck dashboard** | **https://edward-food-truck.vercel.app/dashboard** | Edward's control panel — mark sold out, set inventory, toggle the delivery banner, add catering/closure dates. Changes show on the public site instantly. Password: `ironoaks` |

> **The dashboard is the key thing to demo for Edward** — it's what lets him run
> the live site himself (inventory, sold-out, catering calendar) with no code.

Repo: https://github.com/cghogomu/edward-food-truck (`master` → auto-deploys to Vercel)

## Done

- [x] Build out the site (menu, ordering, calendar, dashboard, community pages)
- [x] Commit work to Git and push to GitHub
- [x] Deploy to Vercel — live and publicly reachable (no login wall)
- [x] Persist site state in **Upstash Redis** so dashboard changes survive on
      Vercel's read-only filesystem (`src/lib/state.ts`; falls back to the local
      JSON file in dev)
- [x] `force-dynamic` rendering so the public pages reflect live state instead of
      being frozen into the static build (`src/app/layout.tsx`)
- [x] Fix Stripe v22 `LineItem` type error that broke the production build
- [x] Fix Redis env-var detection (Vercel injects `KV_REST_API_*`, not
      `UPSTASH_REDIS_REST_*`)
- [x] Verify end-to-end: dashboard toggle → saved to Redis → shown on public site
- [x] Fix open/closed status to use Austin time (`America/Chicago`) instead of the
      UTC server clock, so hours are correct in production
- [x] **Home-page marquee** — expanded to 29 photos + per-image crop-focus so tall
      portraits don't get heads sliced by the 4:3 tiles (`src/components/PhotoStrip.tsx`) *(2026-07-21)*
- [x] **About page** — replaced the dead Unsplash photo with Edward's self-hosted
      headshot (`public/edward-about.jpeg`); reworded bio to name Edward as founder
      while crediting Keilone; dropped the "Photo coming" badge *(2026-07-21)*
- [x] **Dev crash-loop fix** — a stray `C:\…`-named folder + a stale `.next` cache
      caused a Turbopack panic/reload loop (whole-page flicker); removed both *(2026-07-21)*
- [x] **Meridian portfolio** — refreshed the Iron Oaks tile (new home-page
      screenshot) and fixed its link across the Meridian Works site *(2026-07-21)*

## To do

- [ ] **Stripe test-mode checkout** (optional, for a working demo order):
  - [ ] Create Stripe test keys; add `STRIPE_SECRET_KEY` in Vercel env vars
  - [ ] Set `NEXT_PUBLIC_BASE_URL` to the live URL (needed only for Stripe
        success/cancel redirects), then redeploy
  - [ ] Create a Stripe webhook endpoint, add `STRIPE_WEBHOOK_SECRET`, redeploy
  - [ ] Test with card `4242 4242 4242 4242`
- [ ] **Custom domain** — swap in Edward's real domain once available
      (Vercel → Settings → Domains). The `*.vercel.app` URL is the portfolio
      stand-in until then.
- [ ] **Localize remaining stock photos** — menu items "cookies" and "can drink"
      still use working Unsplash stock URLs (`src/content/menu.ts`); swap for real
      or local photos when available.

## Notes

- Dashboard password (`ironoaks`) is a hardcoded demo value — fine for a portfolio
  demo, not real auth.
