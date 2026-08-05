import Link from "next/link";
import { SETTINGS } from "@/content/settings";
import { DELIVERY_ZIPS } from "@/content/zips";
import { DeliveryAreaMap } from "@/components/DeliveryAreaMap";
import { OrderLink } from "@/components/OrderLink";
import { OpenStatusPill } from "@/components/OpenStatusPill";
import { getSiteState, deriveOpenStatus } from "@/lib/state";

/**
 * "How to order" — the practical detail Heartland's storefront doesn't cover:
 * where the truck parks, which ZIPs get delivery, and what to expect. Ordering
 * itself is a link out; see the note in `OrderLink`.
 */
export default async function OrderPage() {
  const state = await getSiteState();
  const status = deriveOpenStatus(state);
  const zips = [...DELIVERY_ZIPS].sort();

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
            How to order
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
            Pickup or delivery,<br />
            <em className="text-(--amber) not-italic">both start here.</em>
          </h1>
        </div>
        <OpenStatusPill status={status} />
      </header>

      <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6 sm:p-8 mb-10">
        <p className="text-(--text-soft) leading-relaxed mb-6">
          Orders and payment run through our Heartland page. Pick your items,
          customize them, choose pickup or delivery, and pay — all in one place.
        </p>
        <OrderLink className="block w-full text-center bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-4 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors">
          Order on Heartland ↗
        </OrderLink>
        <p className="mt-3 text-xs text-(--text-muted) text-center">
          Opens in a new tab ·{" "}
          <Link href="/menu" className="text-(--amber) hover:text-(--text)">
            See the full menu first
          </Link>
        </p>
      </div>

      <section className="grid sm:grid-cols-2 gap-5 mb-10">
        <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
            Pickup
          </div>
          <p className="text-(--text) font-medium">{SETTINGS.location.venue}</p>
          <p className="text-(--text-soft) text-sm mt-1">
            {SETTINGS.location.street}
            <br />
            {SETTINGS.location.cityState}
          </p>
          <p className="text-(--text-soft) text-sm mt-3">
            Open {state.hours.days.join(", ")} · {state.hours.open}–{state.hours.close}
          </p>
        </div>

        <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
            Delivery
          </div>
          <p className="text-(--text) font-medium">
            {SETTINGS.ordering.deliveryFeePromoActive
              ? "Free in our zone right now"
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

      <DeliveryAreaMap />

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
