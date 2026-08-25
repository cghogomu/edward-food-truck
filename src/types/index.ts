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
/** Portions of one menu item left in one service window. */
export type ItemStock = {
  /** Matches a MenuItem id. */
  itemId: string;
  today: number;
  max: number;
};

export type ServicePeriod = {
  id: string;
  /** Shown to customers, e.g. "Lunch". */
  label: string;
  open: string;
  close: string;
  /** Empty means this period isn't running at all right now. */
  days: string[];
  /**
   * Counted per potato, so the site can say which one has run out. The
   * window's total is always the sum of these — never stored separately, or
   * the two drift.
   */
  stock: ItemStock[];
  /** Manual "stop taking orders" for the whole window, regardless of counts. */
  soldOut: boolean;
};

export type SiteState = {
  services: ServicePeriod[];
  freeDeliveryBanner: boolean;
  today: string;
  calendar: CalendarEntry[];
};

/** A service window before stock was counted per item. */
export type LegacyServicePeriod = {
  id: string;
  label: string;
  open: string;
  close: string;
  days: string[];
  inventory: { today: number; max: number };
  soldOut: boolean;
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
  state: "open" | "sold-out" | "closed" | "catering";
  label: string;
  detail?: string;
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
