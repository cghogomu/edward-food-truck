import Image from "next/image";
import Link from "next/link";
import { MENU } from "@/content/menu";
import { getSiteState, deriveOpenStatus } from "@/lib/state";
import { OpenStatusPill } from "@/components/OpenStatusPill";
import { OrderLink } from "@/components/OrderLink";

export default async function MenuPage() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  const orderable = status.state === "open" || status.state === "low";

  const cards = MENU.filter((item) => item.category !== "extra");
  const extras = MENU.filter((item) => item.category === "extra");

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-10 sm:mb-14 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            The menu
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05]">
            A few things,<br />
            <em className="text-(--amber) not-italic">done really well.</em>
          </h1>
        </div>
        <OpenStatusPill status={status} />
      </header>

      <OrderCallout status={status.state} detail={status.detail} orderable={orderable} />

      <div className="space-y-12 sm:space-y-16">
        {cards.map((item) => (
          <article
            key={item.id}
            className={`grid sm:grid-cols-5 gap-7 sm:gap-10 items-start ${item.comingSoon ? "opacity-60" : ""}`}
          >
            <div className="sm:col-span-2 relative aspect-[5/4] rounded-2xl overflow-hidden bg-(--bg-card) border border-(--color-line)">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className={`object-cover ${item.id === "brisket" ? "scale-[0.92] rounded-xl" : ""}`}
              />
            </div>
            <div className="sm:col-span-3">
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
              <p className="text-(--text-soft) leading-relaxed mb-5">
                {item.description}
              </p>

              {/* Ordering happens on Heartland, so the ways this can be customized
                  have to be readable here — otherwise they're invisible until
                  checkout. */}
              {item.modifiers && item.modifiers.length > 0 && (
                <div className="border-t border-(--color-line) pt-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-(--amber) mb-2.5">
                    Make it yours
                  </div>
                  <ul className="flex flex-wrap gap-x-2 gap-y-2">
                    {item.modifiers.map((mod) => (
                      <li
                        key={mod.id}
                        className="text-sm text-(--text-soft) bg-(--bg-card) border border-(--color-line) rounded-full px-3 py-1"
                      >
                        {mod.name}
                        {mod.price ? (
                          <span className="text-(--amber) ml-1.5 font-medium">
                            +${mod.price.toFixed(2)}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.comingSoon && (
                <div className="mt-4 text-(--text-muted) text-sm italic">Coming soon.</div>
              )}
            </div>
          </article>
        ))}
      </div>

      {extras.length > 0 && (
        <div className="mt-14 sm:mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-(--text) mb-5">
            Sides &amp; Drinks
          </h2>
          <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl divide-y divide-(--color-line)">
            {extras.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-lg text-(--text)">{item.name}</span>
                    <span className="text-(--amber) font-medium">${item.price}</span>
                  </div>
                  <p className="text-(--text-soft) text-sm mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Second CTA — the first one is 3+ screens up by the time you've read the menu. */}
      <div className="mt-14 bg-(--bg-card) border border-(--color-line) rounded-2xl p-7 sm:p-9 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl text-(--text) mb-2">
          Ready to eat?
        </h2>
        <p className="text-(--text-soft) text-sm mb-6 max-w-md mx-auto">
          Ordering and payment happen on our Heartland page — pick your potato,
          customize it, and pay there.
        </p>
        <OrderLink className="inline-block bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-8 py-4 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors">
          Order on Heartland ↗
        </OrderLink>
        <p className="mt-4 text-xs text-(--text-muted)">
          Opens in a new tab ·{" "}
          <Link href="/order" className="text-(--amber) hover:text-(--text)">
            Pickup &amp; delivery details
          </Link>
        </p>
      </div>

      <div className="mt-16 pt-12 border-t border-(--color-line) text-center">
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

function OrderCallout({
  status,
  detail,
  orderable,
}: {
  status: string;
  detail?: string;
  orderable: boolean;
}) {
  if (orderable) {
    return (
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 bg-(--bg-card) border border-(--color-line) rounded-2xl p-5 sm:p-6">
        <div className="min-w-0">
          <div className="font-medium text-(--text)">Order online</div>
          <p className="text-(--text-soft) text-sm mt-0.5">
            Browse here, then order and pay on our Heartland page.
          </p>
        </div>
        <OrderLink className="shrink-0 bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors">
          Order now ↗
        </OrderLink>
      </div>
    );
  }

  return (
    <div className="mb-10 bg-(--bg-card) border border-(--color-line) rounded-2xl p-5 sm:p-6">
      <div className="text-sm">
        <strong className="text-(--text)">
          {status === "sold-out" ? "Sold out for today." : "We're closed right now."}
        </strong>
        {detail && <span className="text-(--text-soft)"> {detail}</span>}
      </div>
      <p className="text-(--text-soft) text-sm mt-2">
        The full menu is below.{" "}
        <OrderLink className="text-(--amber) hover:text-(--text) font-medium">
          Check availability on Heartland ↗
        </OrderLink>
      </p>
    </div>
  );
}
