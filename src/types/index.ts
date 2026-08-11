export type CalendarKind = "open" | "closed" | "catering";

export type CalendarEntry = {
  date: string;
  kind: CalendarKind;
  client?: string;
  note?: string;
};

/**
 * One service window — Edward runs lunch and evening, and each carries its own
 * hours, days and portion count. Selling out at lunch must not close the
 * evening, so inventory and soldOut live here rather than on SiteState.
 */
export type ServicePeriod = {
  id: string;
  /** Shown to customers, e.g. "Lunch". */
  label: string;
  open: string;
  close: string;
  /** Empty means this period isn't running at all right now. */
  days: string[];
  inventory: {
    today: number;
    max: number;
  };
  soldOut: boolean;
};

export type SiteState = {
  services: ServicePeriod[];
  freeDeliveryBanner: boolean;
  today: string;
  calendar: CalendarEntry[];
};

/** Shape stored before service periods existed. Still live in Redis. */
export type LegacySiteState = {
  inventory: { today: number; max: number };
  soldOut: boolean;
  freeDeliveryBanner: boolean;
  today: string;
  hours: { open: string; close: string; days: string[] };
  calendar: CalendarEntry[];
};

export type OpenStatus = {
  state: "open" | "low" | "sold-out" | "closed" | "catering";
  label: string;
  detail?: string;
  remaining?: number;
  max?: number;
  cateringClient?: string;
  /** Which window this refers to, when one is running or coming up next. */
  periodLabel?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  /**
   * Spanish half of Heartland's description. Heartland stores both languages in
   * one field split by " / "; we keep them apart so each reads as a paragraph.
   */
  descriptionEs?: string;
  price: number;
  image: string;
  tags?: string[];
  modifiers?: Array<{
    id: string;
    name: string;
    price?: number;
  }>;
  comingSoon?: boolean;
  // "extra" items (sides, drinks) render in a compact list instead of a photo card.
  category?: "extra";
};

export type CartLine = {
  itemId: string;
  qty: number;
  modifierIds: string[];
  note?: string;
};
