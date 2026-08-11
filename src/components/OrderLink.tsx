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
 * same destination, same new-tab behaviour, same rel hardening, and one place
 * that decides what happens when the truck is shut.
 */
export function OrderLink({
  children,
  className,
  ariaLabel,
  disabled = false,
  disabledReason,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** True when the truck is closed, sold out, or catering. */
  disabled?: boolean;
  /** Why it's off, e.g. "Evening starts at 5pm" — surfaced on hover. */
  disabledReason?: string;
}) {
  // Rendered as a span rather than a dead <a>: there's no href to follow, it
  // can't be tabbed into or opened in a new tab, and assistive tech is told.
  if (disabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={disabledReason ?? "Ordering opens when the truck does"}
        className={`${className ?? ""} opacity-40 cursor-not-allowed select-none`}
      >
        {children}
      </span>
    );
  }

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
