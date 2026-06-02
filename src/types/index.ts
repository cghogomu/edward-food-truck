export type CalendarKind = "open" | "closed" | "catering";

export type CalendarEntry = {
  date: string;
  kind: CalendarKind;
  client?: string;
  note?: string;
};

export type SiteState = {
  inventory: {
    today: number;
    max: number;
  };
  soldOut: boolean;
  freeDeliveryBanner: boolean;
  today: string;
  hours: {
    open: string;
    close: string;
    days: string[];
  };
  calendar: CalendarEntry[];
};

export type OpenStatus = {
  state: "open" | "low" | "sold-out" | "closed" | "catering";
  label: string;
  detail?: string;
  remaining?: number;
  max?: number;
  cateringClient?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  modifiers?: Array<{
    id: string;
    name: string;
    price?: number;
  }>;
  comingSoon?: boolean;
};

export type CartLine = {
  itemId: string;
  qty: number;
  modifierIds: string[];
  note?: string;
};
