# Edward's Food Truck — TODO

Live site: https://edward-food-truck.vercel.app
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

## To do

- [ ] **Reset dashboard to "open"** — the site was left "sold out" from testing.
      Go to /dashboard (password `ironoaks`) → "Re-open · reset to full".
- [ ] **Stripe test-mode checkout** (optional, for a working demo order):
  - [ ] Create Stripe test keys; add `STRIPE_SECRET_KEY` in Vercel env vars
  - [ ] Set `NEXT_PUBLIC_BASE_URL` to the live URL (needed only for Stripe
        success/cancel redirects), then redeploy
  - [ ] Create a Stripe webhook endpoint, add `STRIPE_WEBHOOK_SECRET`, redeploy
  - [ ] Test with card `4242 4242 4242 4242`
- [ ] **Custom domain** — swap in Edward's real domain once available
      (Vercel → Settings → Domains). The `*.vercel.app` URL is the portfolio
      stand-in until then.

## Notes

- Dashboard password (`ironoaks`) is a hardcoded demo value — fine for a portfolio
  demo, not real auth.
