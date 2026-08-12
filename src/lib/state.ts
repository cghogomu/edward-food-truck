import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type {
  SiteState,
  LegacySiteState,
  LegacyServicePeriod,
  ServicePeriod,
  ItemStock,
  OpenStatus,
  CalendarEntry,
} from "@/types";
import { MAIN_ITEMS } from "@/content/menu";

const STATE_FILE = path.join(process.cwd(), "data", "site-state.json");
const STATE_KEY = "edward-food-truck:site-state";

// Hosts like Vercel run on a read-only filesystem, so file writes silently
// fail there. When Upstash Redis env vars are present we persist to Redis;
// otherwise (local dev) we fall back to the JSON file on disk.
// `Redis.fromEnv()` accepts either the `UPSTASH_REDIS_REST_*` names or the
// `KV_REST_API_*` names that Vercel's Upstash integration injects, so we
// gate on both here too.
const hasRedis =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redis = hasRedis ? Redis.fromEnv() : null;

const DEFAULT_MAX = 20;

/** Portions left in a window — always the sum of its per-item counts. */
export function periodRemaining(p: ServicePeriod): number {
  return p.stock.reduce((n, s) => n + s.today, 0);
}

export function periodMax(p: ServicePeriod): number {
  return p.stock.reduce((n, s) => n + s.max, 0);
}

/**
 * Split one window-wide portion count across the potatoes, preserving the
 * total exactly — the first item absorbs the remainder so 15 across two items
 * becomes 8 + 7 rather than 7 + 7 and a lost portion.
 */
function splitEvenly(total: number, parts: number): number[] {
  if (parts <= 0) return [];
  const base = Math.floor(total / parts);
  const rem = total - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < rem ? 1 : 0));
}

/**
 * Guarantees every potato on the menu has a stock row, and drops rows for
 * items that have left the menu. Without this, adding a potato to menu.ts
 * would show it as permanently sold out.
 */
function normaliseStock(stock: ItemStock[]): ItemStock[] {
  const fallbackMax = stock.length
    ? Math.max(...stock.map((s) => s.max))
    : DEFAULT_MAX;
  return MAIN_ITEMS.map((item) => {
    const found = stock.find((s) => s.itemId === item.id);
    return found ?? { itemId: item.id, today: fallbackMax, max: fallbackMax };
  });
}

function isLegacyPeriod(
  p: ServicePeriod | LegacyServicePeriod
): p is LegacyServicePeriod {
  return !Array.isArray((p as ServicePeriod).stock);
}

/**
 * State written before per-item stock, and before service windows at all, is
 * still live in production Redis. Every read is normalised rather than trusted.
 *
 * Pre-windows state puts its hours into the FIRST window untouched, so
 * migrating can't change when the truck appears open; the second window is
 * added inactive rather than inventing an evening service. A window-wide
 * portion count is split evenly across the potatoes, which keeps the total the
 * customer already saw.
 */
function migrate(
  raw: SiteState | LegacySiteState | { services: LegacyServicePeriod[] }
): SiteState {
  const asNew = raw as SiteState;

  if (Array.isArray(asNew.services)) {
    return {
      ...asNew,
      services: (asNew.services as Array<ServicePeriod | LegacyServicePeriod>).map(
        (p) => {
          if (!isLegacyPeriod(p)) {
            return { ...p, stock: normaliseStock(p.stock) };
          }
          const totalMax = p.inventory?.max ?? DEFAULT_MAX * MAIN_ITEMS.length;
          // Missing counts mean "we have no idea", not "sold out" — default to
          // a full batch so a malformed record can't silently close the truck.
          const todays = splitEvenly(p.inventory?.today ?? totalMax, MAIN_ITEMS.length);
          const maxes = splitEvenly(totalMax, MAIN_ITEMS.length);
          // Drop the old single-count field; `stock` replaces it.
          const rest: Omit<LegacyServicePeriod, "inventory"> & {
            inventory?: unknown;
          } = { ...p };
          delete rest.inventory;
          return {
            ...(rest as Omit<LegacyServicePeriod, "inventory">),
            stock: MAIN_ITEMS.map((item, i) => ({
              itemId: item.id,
              today: todays[i] ?? 0,
              max: maxes[i] ?? DEFAULT_MAX,
            })),
          };
        }
      ),
    };
  }

  const legacy = raw as LegacySiteState;
  const max = legacy.inventory?.max ?? DEFAULT_MAX * MAIN_ITEMS.length;
  const todays = splitEvenly(legacy.inventory?.today ?? max, MAIN_ITEMS.length);
  const maxes = splitEvenly(max, MAIN_ITEMS.length);

  const services: ServicePeriod[] = [
    {
      id: "lunch",
      label: "Lunch",
      open: legacy.hours?.open ?? "11:00",
      close: legacy.hours?.close ?? "14:00",
      days: legacy.hours?.days ?? [],
      stock: MAIN_ITEMS.map((item, i) => ({
        itemId: item.id,
        today: todays[i] ?? 0,
        max: maxes[i] ?? DEFAULT_MAX,
      })),
      soldOut: legacy.soldOut ?? false,
    },
    {
      id: "evening",
      label: "Evening",
      open: "17:00",
      close: "20:00",
      days: [],
      stock: MAIN_ITEMS.map((item, i) => ({
        itemId: item.id,
        today: maxes[i] ?? DEFAULT_MAX,
        max: maxes[i] ?? DEFAULT_MAX,
      })),
      soldOut: false,
    },
  ];

  return {
    services,
    freeDeliveryBanner: legacy.freeDeliveryBanner ?? true,
    today: legacy.today ?? todayKey(),
    calendar: legacy.calendar ?? [],
  };
}

async function readSeed(): Promise<SiteState> {
  const raw = await fs.readFile(STATE_FILE, "utf-8");
  return migrate(JSON.parse(raw) as SiteState | LegacySiteState);
}

export async function getSiteState(): Promise<SiteState> {
  if (!redis) return readSeed();

  const stored = await redis.get<SiteState | LegacySiteState>(STATE_KEY);
  if (stored) {
    const migrated = migrate(stored);
    // Write the upgraded shape back once, so this doesn't run on every request
    // and so a later partial patch can't reintroduce the old fields.
    if (migrated !== stored) await redis.set(STATE_KEY, migrated);
    return migrated;
  }

  // First request against a fresh Redis: seed it from the bundled JSON so the
  // deployed site starts with the same data it ships with.
  const seed = await readSeed();
  await redis.set(STATE_KEY, seed);
  return seed;
}

export async function writeSiteState(state: SiteState): Promise<void> {
  if (!redis) {
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
    return;
  }
  await redis.set(STATE_KEY, state);
}

export async function patchSiteState(
  patch: Partial<SiteState>
): Promise<SiteState> {
  const current = await getSiteState();
  const next: SiteState = { ...current, ...patch };
  await writeSiteState(next);
  return next;
}

// The truck operates in Austin, TX. Hours, day-of-week, and "today" must be
// evaluated in that timezone — otherwise the deployed server (which runs in
// UTC on Vercel) compares against the wrong clock and reports the wrong open
// status (e.g. "Closed right now" during real business hours).
const TRUCK_TZ = "America/Chicago";

function truckNow(): { dateKey: string; day: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TRUCK_TZ,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  // `hour12: false` can emit "24" at midnight in some runtimes — normalize it.
  const hour = get("hour") === "24" ? 0 : Number(get("hour"));
  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    day: get("weekday"),
    minutes: hour * 60 + Number(get("minute")),
  };
}

function todayKey(): string {
  return truckNow().dateKey;
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isWithinHours(open: string, close: string): boolean {
  const minutes = truckNow().minutes;
  return minutes >= toMinutes(open) && minutes < toMinutes(close);
}

/** Periods running today, earliest first. */
function periodsToday(state: SiteState, dayOverride: boolean): ServicePeriod[] {
  const dayName = truckNow().day;
  return state.services
    .filter((s) => s.days.length > 0 && (dayOverride || s.days.includes(dayName)))
    .sort((a, b) => toMinutes(a.open) - toMinutes(b.open));
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

/** "Lunch 11am–2pm · Evening 5pm–8pm" */
function describe(periods: ServicePeriod[]): string {
  return periods
    .map((p) => `${p.label} ${formatTime(p.open)}–${formatTime(p.close)}`)
    .join(" · ");
}

function isSoldOut(p: ServicePeriod): boolean {
  return p.soldOut || periodRemaining(p) <= 0;
}

/** Per-potato counts for the public status, named for display. */
function stockFor(p: ServicePeriod) {
  return p.stock.map((s) => ({
    itemId: s.itemId,
    name: MAIN_ITEMS.find((m) => m.id === s.itemId)?.name ?? s.itemId,
    today: s.today,
    max: s.max,
  }));
}

/**
 * Whether the truck can take an order right now. Every "Order on Heartland"
 * CTA is gated on this — sending someone to checkout while the truck is closed,
 * sold out, or off catering just produces an order nobody can fill.
 */
export function isOrderable(status: OpenStatus): boolean {
  return status.state === "open" || status.state === "low";
}

/** Every day any service runs — for "is the truck out at all today?" checks. */
export function servingDays(state: SiteState): string[] {
  const all = new Set(state.services.flatMap((s) => s.days));
  return DAY_ORDER.filter((d) => all.has(d));
}

/** "Lunch 11am–2pm · Evening 5pm–8pm", skipping any period that isn't running. */
export function describeServices(state: SiteState): string {
  return describe(
    [...state.services]
      .filter((s) => s.days.length > 0)
      .sort((a, b) => toMinutes(a.open) - toMinutes(b.open))
  );
}

const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function findToday(calendar: CalendarEntry[]): CalendarEntry | undefined {
  return calendar.find((e) => e.date === todayKey());
}

/**
 * Derive the public "Are we open?" status from raw site state.
 * Order of precedence: explicit calendar entry > sold-out flag >
 * inventory check > hours/day check.
 */
export function deriveOpenStatus(state: SiteState): OpenStatus {
  const todayEntry = findToday(state.calendar);

  if (todayEntry?.kind === "catering") {
    return {
      state: "catering",
      label: "Catering today",
      detail: todayEntry.client
        ? `We're at ${todayEntry.client}. Back tomorrow.`
        : "We're catering today. Back tomorrow.",
      cateringClient: todayEntry.client,
    };
  }

  if (todayEntry?.kind === "closed") {
    return {
      state: "closed",
      label: "Closed today",
      detail: todayEntry.note ?? "Back at our next regular service.",
    };
  }

  const today = periodsToday(state, todayEntry?.kind === "open");

  if (today.length === 0) {
    const anyDays = state.services.filter((s) => s.days.length > 0);
    return {
      state: "closed",
      label: "Closed today",
      detail: anyDays.length
        ? `Next: ${describe(anyDays)}`
        : "Back at our next regular service.",
    };
  }

  // A window that's running right now wins. Each carries its own portions, so
  // selling out at lunch leaves the evening untouched.
  const active = today.find((p) => isWithinHours(p.open, p.close));

  if (active) {
    if (isSoldOut(active)) {
      const later = today.find(
        (p) => toMinutes(p.open) > truckNow().minutes && !isSoldOut(p)
      );
      return later
        ? {
            state: "sold-out",
            label: `${active.label} is sold out`,
            detail: `${later.label} service starts at ${formatTime(later.open)}.`,
            periodLabel: active.label,
          }
        : {
            state: "sold-out",
            label: "Sold out for today",
            detail: "Back tomorrow with a fresh batch.",
            periodLabel: active.label,
          };
    }

    const remaining = periodRemaining(active);
    const max = periodMax(active);
    const low = remaining <= Math.ceil(max * 0.25);
    return {
      state: low ? "low" : "open",
      label: low ? "Almost gone" : "Open now",
      detail: `${active.label} · ${remaining} of ${max} portions left`,
      remaining,
      max,
      periodLabel: active.label,
      stock: stockFor(active),
    };
  }

  // Between windows — point at the next one that still has food.
  const upcoming = today.filter((p) => toMinutes(p.open) > truckNow().minutes);
  const next = upcoming.find((p) => !isSoldOut(p));

  if (next) {
    return {
      state: "closed",
      label: "Closed right now",
      detail: `${next.label} starts at ${formatTime(next.open)}`,
      remaining: periodRemaining(next),
      max: periodMax(next),
      periodLabel: next.label,
      stock: stockFor(next),
    };
  }

  if (upcoming.length > 0) {
    return {
      state: "sold-out",
      label: "Sold out for today",
      detail: "Back tomorrow with a fresh batch.",
    };
  }

  return {
    state: "closed",
    label: "Closed for today",
    detail: `Today's service · ${describe(today)}`,
  };
}
