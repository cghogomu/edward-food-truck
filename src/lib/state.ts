import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type {
  SiteState,
  LegacySiteState,
  ServicePeriod,
  OpenStatus,
  CalendarEntry,
} from "@/types";

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

/**
 * State stored before service periods existed has a single `hours`/`inventory`
 * pair. That shape is live in production Redis, so every read is normalised
 * rather than trusted.
 *
 * The old hours become the FIRST period untouched, so migrating can't silently
 * change when the truck appears to be open. The second period is added with
 * sensible times but no days selected — inactive until Edward turns it on,
 * because inventing an evening service he isn't running would be worse than
 * making him tick five boxes.
 */
function migrate(raw: SiteState | LegacySiteState): SiteState {
  if (Array.isArray((raw as SiteState).services)) return raw as SiteState;

  const legacy = raw as LegacySiteState;
  const max = legacy.inventory?.max ?? 20;
  const services: ServicePeriod[] = [
    {
      id: "lunch",
      label: "Lunch",
      open: legacy.hours?.open ?? "11:00",
      close: legacy.hours?.close ?? "14:00",
      days: legacy.hours?.days ?? [],
      inventory: legacy.inventory ?? { today: max, max },
      soldOut: legacy.soldOut ?? false,
    },
    {
      id: "evening",
      label: "Evening",
      open: "17:00",
      close: "20:00",
      days: [],
      inventory: { today: max, max },
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
  return p.soldOut || p.inventory.today <= 0;
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

    const low =
      active.inventory.today <= Math.ceil(active.inventory.max * 0.25);
    return {
      state: low ? "low" : "open",
      label: low ? "Almost gone" : "Open now",
      detail: `${active.label} · ${active.inventory.today} of ${active.inventory.max} portions left`,
      remaining: active.inventory.today,
      max: active.inventory.max,
      periodLabel: active.label,
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
      remaining: next.inventory.today,
      max: next.inventory.max,
      periodLabel: next.label,
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
