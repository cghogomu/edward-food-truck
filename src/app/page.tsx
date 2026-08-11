import Link from "next/link";
import Image from "next/image";
import { getSiteState, deriveOpenStatus } from "@/lib/state";
import { OpenStatusHero } from "@/components/OpenStatusHero";
import { MENU, formatPrice } from "@/content/menu";
import { SETTINGS } from "@/content/settings";
import { PhotoStrip } from "@/components/PhotoStrip";
import { DeliveryAreaMap } from "@/components/DeliveryAreaMap";
import { DELIVERY_ZIPS } from "@/content/zips";

export default async function Home() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  const signatures = MENU.filter((m) => !m.comingSoon).slice(0, 2);
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
            <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-5">
              {SETTINGS.brand.tagline}
            </p>
            {/* The free-delivery offer is the headline while it's running. When
                Edward switches it off from the dashboard, the hero falls back to
                the brand line rather than going blank. */}
            {freeDelivery ? (
              <>
                <h1 className="font-serif text-5xl sm:text-7xl leading-[1.02] tracking-tight text-(--text)">
                  Free delivery,
                  <br />
                  <em className="text-gold-chrome not-italic font-medium">
                    on every order.
                  </em>
                </h1>
                <p className="mt-6 text-(--text-soft) text-lg leading-relaxed max-w-lg">
                  North Austin, Round Rock, and Pflugerville — no delivery fee,
                  no end date. Hand-finished loaded potatoes, plated one at a
                  time.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-serif text-5xl sm:text-7xl leading-[1.02] tracking-tight text-(--text)">
                  Upscale quality,
                  <br />
                  <em className="text-gold-chrome not-italic font-medium">
                    for blue collar pockets.
                  </em>
                </h1>
                <p className="mt-6 text-(--text-soft) text-lg leading-relaxed max-w-lg">
                  Hand-finished loaded potatoes, plated one at a time. A few
                  things, done really well.
                </p>
              </>
            )}
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
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                Where we deliver
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl leading-tight mb-5">
                Straight to your door.
              </h2>
              <p className="text-(--text-soft) leading-relaxed mb-6">
                We run delivery across north Austin, Round Rock, and
                Pflugerville — {DELIVERY_ZIPS.size} ZIP codes in all. Check the
                map, then order and we&apos;ll bring it out.
              </p>
              <Link
                href="/order"
                className="text-(--amber) hover:text-(--text) text-sm font-medium"
              >
                See the full ZIP list →
              </Link>
            </div>
            <DeliveryAreaMap />
          </div>
        </section>

        {/* PHOTO STRIP */}
        <PhotoStrip />

      {/* SIGNATURES */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="flex items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
              The menu
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight">
              Loaded baked potatoes.<br />
              <em className="text-(--text-soft) not-italic">Always done the right way.</em>
            </h2>
          </div>
          <Link
            href="/menu"
            className="hidden sm:inline text-sm text-(--text-soft) hover:text-(--amber) transition-colors shrink-0"
          >
            See the full menu →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-7">
          {signatures.map((item) => (
            <Link
              key={item.id}
              href="/menu"
              className="group bg-(--bg-card) hover:bg-(--bg-card-hover) rounded-2xl overflow-hidden border border-(--color-line) transition-all hover:border-(--amber)/30"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h3 className="font-serif text-2xl text-(--text)">{item.name}</h3>
                  <span className="font-serif text-xl text-(--amber)">{formatPrice(item.price)}</span>
                </div>
                <p className="text-(--text-soft) text-sm leading-relaxed">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/menu"
          className="sm:hidden block mt-6 text-center text-sm text-(--amber)"
        >
          See the full menu →
        </Link>
      </section>

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
