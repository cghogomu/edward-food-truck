import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { SiteState, OpenStatus, CalendarEntry } from "@/types";

const STATE_FILE = path.join(process.cwd(), "data", "site-state.json");
const STATE_KEY = "edward-food-truck:site-state";

// Hosts like Vercel run on a read-only filesystem, so file writes silently
// fail there. When Upstash Redis env vars are present we persist to Redis;
// otherwise (local dev) we fall back to the JSON file on disk.
const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;

async function readSeed(): Promise<SiteState> {
  const raw = await fs.readFile(STATE_FILE, "utf-8");
  return JSON.parse(raw) as SiteState;
}

export async function getSiteState(): Promise<SiteState> {
  if (!redis) return readSeed();

  const stored = await redis.get<SiteState>(STATE_KEY);
  if (stored) return stored;

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

const DAY_LOOKUP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function isWithinHours(open: string, close: string): boolean {
  const now = new Date();
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= oh * 60 + om && minutes < ch * 60 + cm;
}

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

  const today = new Date();
  const dayName = DAY_LOOKUP[today.getDay()];
  const isOperatingDay = state.hours.days.includes(dayName);

  if (!isOperatingDay && todayEntry?.kind !== "open") {
    return {
      state: "closed",
      label: "Closed today",
      detail: `Open ${state.hours.days.join(", ")} · ${state.hours.open}–${state.hours.close}`,
    };
  }

  if (state.soldOut || state.inventory.today <= 0) {
    return {
      state: "sold-out",
      label: "Sold out for today",
      detail: "Back tomorrow with a fresh batch.",
    };
  }

  if (!isWithinHours(state.hours.open, state.hours.close)) {
    return {
      state: "closed",
      label: "Closed right now",
      detail: `Today's hours · ${state.hours.open}–${state.hours.close}`,
      remaining: state.inventory.today,
      max: state.inventory.max,
    };
  }

  const low = state.inventory.today <= Math.ceil(state.inventory.max * 0.25);

  return {
    state: low ? "low" : "open",
    label: low ? "Almost gone" : "Open now",
    detail: `${state.inventory.today} of ${state.inventory.max} portions left`,
    remaining: state.inventory.today,
    max: state.inventory.max,
  };
}
