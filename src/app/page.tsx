import Link from "next/link";
import Image from "next/image";
import { getSiteState, deriveOpenStatus } from "@/lib/state";
import { OpenStatusHero } from "@/components/OpenStatusHero";
import { MENU } from "@/content/menu";
import { SETTINGS } from "@/content/settings";
import { PhotoStrip } from "@/components/PhotoStrip";

export default async function Home() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  const signatures = MENU.filter((m) => !m.comingSoon).slice(0, 2);

  return (
    <>
      {/* FIXED HERO BACKDROP — holds steady while the page scrolls up over it */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/hero-truck.jpg"
          alt="Iron Oaks BBQ food truck at night"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-95 opacity-100 brightness-[1.75]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 10% 20%, rgba(5,7,6,0.97) 0%, rgba(5,7,6,0.84) 32%, rgba(5,7,6,0.36) 58%, rgba(5,7,6,0) 78%), linear-gradient(90deg, rgba(5,7,6,0.6) 0%, rgba(5,7,6,0.28) 32%, rgba(5,7,6,0.04) 55%, rgba(5,7,6,0) 68%), linear-gradient(270deg, rgba(5,7,6,0.4) 0%, rgba(5,7,6,0.18) 22%, rgba(5,7,6,0.04) 40%, rgba(5,7,6,0) 55%), linear-gradient(180deg, rgba(5,7,6,0.1) 0%, rgba(5,7,6,0.2) 70%, rgba(5,7,6,0.7) 88%, rgba(5,7,6,1) 100%)",
          }}
        />
      </div>

      {/* HERO — transparent, tall enough to reveal the fixed backdrop */}
      <section className="relative min-h-[90svh]">
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-5">
              {SETTINGS.brand.tagline}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl leading-[1.02] tracking-tight text-(--text)">
              Upscale quality,
              <br />
              <em className="text-gold-chrome not-italic font-medium">
                for blue collar pockets.
              </em>
            </h1>
            <p className="mt-6 text-(--text-soft) text-lg leading-relaxed max-w-lg">
              Hand-finished loaded potatoes, plated one at a time. A few things,
              done really well.
            </p>
          </div>

          <div className="mt-10 max-w-2xl">
            <OpenStatusHero status={status} />
          </div>

          <div className="mt-6 max-w-2xl text-(--text-soft)">
            <span className="text-(--text) font-medium">Come visit us</span> —{" "}
            {SETTINGS.location.venue}, {SETTINGS.location.street},{" "}
            {SETTINGS.location.cityState}.{" "}
            <a
              href={SETTINGS.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--amber) hover:text-(--text) font-medium transition-colors whitespace-nowrap"
            >
              Get directions →
            </a>
          </div>
        </div>
      </section>

      {/* CONTENT — one continuous veil that fades in at the marquee and holds
          steady to the bottom, so the truck dims once with no repeated breaks */}
      <div
        className="relative z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,6,0) 0, rgba(5,7,6,0.65) 90px, rgba(5,7,6,0.65) 100%)",
        }}
      >
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
                  <span className="font-serif text-xl text-(--amber)">${item.price}</span>
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
