import Image from "next/image";
import Link from "next/link";
import { MENU } from "@/content/menu";
import { AddToCartButton } from "@/components/menu/AddToCartButton";
import { getSiteState, deriveOpenStatus } from "@/lib/state";
import { OpenStatusPill } from "@/components/OpenStatusPill";

export default async function MenuPage() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  const orderable = status.state === "open" || status.state === "low";

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-10 sm:mb-14 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            The menu
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05]">
            A few things,<br />
            <em className="text-(--amber) not-italic">done really well.</em>
          </h1>
        </div>
        <OpenStatusPill status={status} />
      </header>

      {!orderable && (
        <div className="mb-10 bg-(--bg-card) border border-(--color-line) rounded-2xl p-5 text-sm">
          <strong className="text-(--text)">Ordering is paused right now.</strong>
          <span className="text-(--text-soft)"> {status.detail}</span>
        </div>
      )}

      <div className="space-y-12 sm:space-y-16">
        {MENU.map((item) => (
          <article
            key={item.id}
            className={`grid sm:grid-cols-5 gap-7 sm:gap-10 items-start ${item.comingSoon ? "opacity-60" : ""}`}
          >
            <div className="sm:col-span-3 relative aspect-[5/4] rounded-2xl overflow-hidden bg-(--bg-card) border border-(--color-line)">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <h2 className="font-serif text-3xl text-(--text) leading-tight">
                  {item.name}
                </h2>
                {!item.comingSoon && (
                  <span className="font-serif text-2xl text-(--amber)">${item.price}</span>
                )}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-[0.15em] text-(--amber) bg-(--amber)/10 border border-(--amber)/30 px-2 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-(--text-soft) leading-relaxed mb-6">
                {item.description}
              </p>
              {orderable ? (
                <AddToCartButton item={item} />
              ) : (
                <div className="text-(--text-muted) text-sm italic">
                  Add to cart re-opens when {status.state === "sold-out" ? "we restock tomorrow" : "we're open"}.
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 pt-12 border-t border-(--color-line) text-center">
        <p className="text-(--text-soft) mb-4">
          Have a question about ingredients or allergens?
        </p>
        <Link
          href="/about"
          className="text-(--amber) hover:text-(--text) text-sm font-medium"
        >
          Read our sourcing notes →
        </Link>
      </div>
    </div>
  );
}
