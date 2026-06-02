import Link from "next/link";
import Image from "next/image";
import { getSiteState, deriveOpenStatus } from "@/lib/state";
import { OpenStatusHero } from "@/components/OpenStatusHero";
import { MENU } from "@/content/menu";
import { SETTINGS } from "@/content/settings";
import { COMMUNITY_VALUE, HOST_BUSINESS } from "@/content/spotlight";

export default async function Home() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  const signatures = MENU.filter((m) => !m.comingSoon).slice(0, 2);

  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1761712826074-5f1bab2b2f32?w=1800&q=80&auto=format&fit=crop"
            alt="Loaded baked potato"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(19,17,15,0.6) 0%, rgba(19,17,15,0.85) 60%, rgba(19,17,15,1) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-2xl">
            <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-5">
              {SETTINGS.brand.tagline}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl leading-[1.02] tracking-tight text-(--text)">
              Upscale quality,
              <br />
              <em className="text-(--amber) not-italic font-medium">
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
        </div>
      </section>

      {/* SIGNATURES */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-3">
              The menu
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight">
              Two potatoes.<br />
              <em className="text-(--text-soft) not-italic">A third on the way.</em>
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

      {/* COMMUNITY */}
      <section className="bg-(--bg-raised) border-y border-(--color-line)">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-3">
              We are all we got
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight mb-5">
              The street eats together.
            </h2>
            <p className="text-(--text-soft) leading-relaxed mb-6">
              {COMMUNITY_VALUE}
            </p>
            <Link
              href="/community"
              className="inline-block text-(--amber) hover:text-(--text) text-sm font-medium transition-colors"
            >
              Meet our partners →
            </Link>
          </div>

          <div className="bg-(--bg-card) rounded-2xl border border-(--color-line) p-7">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
              We park here thanks to
            </p>
            <p className="font-serif text-2xl text-(--text) mb-3">
              {HOST_BUSINESS.name}
            </p>
            <p className="text-(--text-soft) text-sm leading-relaxed">
              {HOST_BUSINESS.blurb}
            </p>
          </div>
        </div>
      </section>

      {/* STORY TEASE */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
        <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-4">
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
    </>
  );
}
