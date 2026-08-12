import Link from "next/link";
import { getSiteState, deriveOpenStatus } from "@/lib/state";
import { OpenStatusHero } from "@/components/OpenStatusHero";
import { SETTINGS } from "@/content/settings";
import { PhotoStrip } from "@/components/PhotoStrip";
import { DeliveryAreaMap } from "@/components/DeliveryAreaMap";
import { DELIVERY_ZIPS } from "@/content/zips";

export default async function Home() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  // Dashboard switch for the free-delivery offer. Named `freeDeliveryBanner` in
  // stored state from when it drove a top bar; it now drives the hero headline.
  const freeDelivery = state.freeDeliveryBanner;

  return (
    <>
      {/* No hero backdrop for now — Edward wants to wait for a photo of his
          own truck rather than run a stock one. The page sits on the site's
          black (--bg), the same surface as every other page.

          To restore: put a fixed `inset-0 -z-10` layer back here holding the
          photo plus a dark gradient veil, and give the hero section below a
          tall min-height (it was `min-h-[90svh]`) so the backdrop shows while
          the content scrolls up over it. */}

      {/* HERO */}
      <section className="relative">
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl sm:text-7xl leading-[1.02] tracking-tight text-(--text)">
              {SETTINGS.brand.tagline}
            </h1>

            {/* Second line carries the offer while it's running. Switched off
                from the dashboard, it falls back to the brand line rather than
                leaving the headline hanging on its own. */}
            {/* leading + a hair of bottom padding: .text-gold-chrome paints via
                background-clip, so the box has to be tall enough to contain the
                descenders in "delivery"/"every" or they get sliced off. */}
            <p className="mt-4 font-serif text-3xl sm:text-5xl leading-[1.25] pb-[0.08em] text-gold-chrome font-medium">
              {freeDelivery
                ? "Free delivery, on every order."
                : "Upscale quality, for blue collar pockets."}
            </p>

            <p className="mt-6 text-(--text-soft) text-lg leading-relaxed max-w-lg">
              {freeDelivery
                ? "North Austin, Round Rock, and Pflugerville — no delivery fee, no end date. Hand-finished, plated one at a time."
                : "Hand-finished loaded potatoes, plated one at a time. A few things, done really well."}
            </p>
          </div>

          <div className="mt-10 max-w-2xl">
            <OpenStatusHero status={status} />
          </div>

        </div>
      </section>

      {/* CONTENT — the veil that used to sit here only existed to dim the hero
          photo behind it. With no backdrop it composites to the page colour, so
          it's gone rather than left as a no-op. Restore it alongside the photo. */}
      <div className="relative z-0">
        {/* DELIVERY ZONE — sits directly under the hero because the hero now
            claims free delivery, and this is the proof of who gets it. */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          {/* 5/7 split, aligned to the top: the map is portrait and much taller
              than the copy, so a 50/50 centred row left the text floating in
              the middle of a lot of empty space. The ZIP list fills the column
              and saves a trip to the order page to find it. */}
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-5">
              <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                Where we deliver
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl leading-tight mb-5">
                Straight to your door.
              </h2>
              <p className="text-(--text-soft) leading-relaxed mb-6">
                Free delivery across north Austin, Round Rock, and Pflugerville
                — {DELIVERY_ZIPS.size} ZIP codes in all.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {[...DELIVERY_ZIPS].sort().map((z) => (
                  <span
                    key={z}
                    className="text-xs text-(--text-soft) bg-(--bg-card) border border-(--color-line) rounded px-2 py-1"
                  >
                    {z}
                  </span>
                ))}
              </div>

              <p className="text-(--text-muted) text-sm">
                Not sure if you&apos;re covered? Your address is checked at
                checkout.{" "}
                <Link
                  href="/order"
                  className="text-(--amber) hover:text-(--text) font-medium"
                >
                  How ordering works →
                </Link>
              </p>
            </div>

            <div className="md:col-span-7">
              <DeliveryAreaMap />
            </div>
          </div>
        </section>

        {/* PHOTO STRIP */}
        <PhotoStrip />

      {/* STORY TEASE */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16 text-center">
        <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-4">
          The shop
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-5">
          One pitmaster. One right hand.<br />
          One potato at a time.
        </h2>
        <p className="text-(--text-soft) leading-relaxed mb-8">
          Iron Oaks is two people doing what most kitchens spread across ten.
          That&apos;s by design. We&apos;d rather make ten great potatoes than fifty
          average ones.
        </p>
        <Link
          href="/about"
          className="inline-block text-(--amber) hover:text-(--text) text-sm font-medium transition-colors"
        >
          Read the story →
        </Link>
      </section>
      </div>
    </>
  );
}
