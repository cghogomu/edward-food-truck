import Link from "next/link";
import { SETTINGS } from "@/content/settings";
import { DELIVERY_ZIPS } from "@/content/zips";
import { OrderLink } from "@/components/OrderLink";
import { OpenStatusPill } from "@/components/OpenStatusPill";
import { getSiteState, deriveOpenStatus, isOrderable } from "@/lib/state";

/**
 * "How to order" — the practical detail Heartland's storefront doesn't cover:
 * when the truck runs and which ZIPs get delivery. Delivery-only for now, so
 * there's no pickup card. Ordering itself is a link out; see `OrderLink`.
 */
export default async function OrderPage() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  const zips = [...DELIVERY_ZIPS].sort();
  const orderable = isOrderable(status);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            How to order
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
            Delivery only,<br />
            <em className="text-(--amber) not-italic">straight to you.</em>
          </h1>
        </div>
        <OpenStatusPill status={status} />
      </header>

      <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6 sm:p-8 mb-10">
        <p className="text-(--text-soft) leading-relaxed mb-6">
          Orders and payment run through our Heartland page. Pick your items,
          customize them, add your address, and pay — all in one place.
        </p>
        <OrderLink
          disabled={!orderable}
          disabledReason={status.detail}
          className="block w-full text-center bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-4 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors"
        >
          {orderable ? "Order on Heartland ↗" : "Ordering closed"}
        </OrderLink>
        <p className="mt-3 text-xs text-(--text-muted) text-center">
          {orderable ? "Opens in a new tab" : status.detail ?? "Back at our next service"} ·{" "}
          <Link href="/menu" className="text-(--amber) hover:text-(--text)">
            See the full menu first
          </Link>
        </p>
      </div>

      <section className="grid sm:grid-cols-2 gap-5 mb-10">
        {/* No pickup card — Edward is delivery-only for now, so the truck's
            parking spot isn't published anywhere on the site. */}
        <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
            When we run
          </div>
          <div className="text-(--text-soft) text-sm space-y-2">
            {state.services
              .filter((s) => s.days.length > 0)
              .map((s) => (
                <div key={s.id}>
                  <div className="text-(--text) font-medium">
                    {s.label} · {s.open}–{s.close}
                  </div>
                  <div className="text-(--text-soft)">{s.days.join(", ")}</div>
                </div>
              ))}
          </div>
          <p className="text-(--text-muted) text-xs mt-4">
            Austin time. Sold out early some days — the badge up top is live.
          </p>
        </div>

        <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
            Delivery
          </div>
          {/* Same dashboard switch as the home-page headline, so the two pages
              can't contradict each other about whether delivery is free. */}
          <p className="text-(--text) font-medium">
            {state.freeDeliveryBanner
              ? "Free in our zone"
              : `$${SETTINGS.ordering.deliveryFee.toFixed(2)} in our zone`}
          </p>
          <p className="text-(--text-soft) text-sm mt-1">
            North Austin, Round Rock, and Pflugerville — {DELIVERY_ZIPS.size} ZIP
            codes.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {zips.map((z) => (
              <span
                key={z}
                className="text-xs text-(--text-soft) bg-(--bg) border border-(--color-line) rounded px-2 py-1"
              >
                {z}
              </span>
            ))}
          </div>
          <p className="text-(--text-muted) text-xs mt-4">
            Confirm your address is covered at checkout on Heartland.
          </p>
        </div>
      </section>

      <div className="mt-10 text-center">
        <p className="text-(--text-soft) text-sm mb-4">
          Feeding a crew? Catering is booked separately.
        </p>
        <Link
          href="/catering"
          className="text-(--amber) hover:text-(--text) text-sm font-medium"
        >
          See catering options →
        </Link>
      </div>
    </div>
  );
}
