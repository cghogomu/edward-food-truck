import type { ReactNode } from "react";
import { SETTINGS } from "@/content/settings";

/**
 * Every "order" entry point on the site opens Edward's Heartland storefront.
 *
 * Ordering deliberately does NOT happen on this site: Heartland already runs the
 * menu, cart, checkout and payment, and offers no documented way to receive a
 * cart built elsewhere. Rebuilding one here meant customers re-typed the whole
 * order on arrival, so the site sells the food and Heartland takes the order.
 *
 * Routing every CTA through this component keeps that one-way door consistent —
 * same destination, same new-tab behaviour, same rel hardening.
 *
 * This link is never disabled. It used to switch off whenever the truck was
 * closed, sold out or catering, which meant customers trying to order ahead for
 * later in the day couldn't reach Heartland at all. Whether an order can be
 * filled is Heartland's call, not this site's — the open/closed status is shown
 * as information beside the button instead of being enforced by it.
 */
export function OrderLink({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={SETTINGS.ordering.orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
