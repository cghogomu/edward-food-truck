import { getSiteState } from "@/lib/state";
import { SETTINGS } from "@/content/settings";
import type { CalendarEntry } from "@/types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  out.setDate(out.getDate() - out.getDay());
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function deriveDayKind(
  date: Date,
  calendar: CalendarEntry[],
  operatingDays: string[]
): { kind: "open" | "closed" | "catering"; entry?: CalendarEntry } {
  const explicit = calendar.find((e) => e.date === dateKey(date));
  if (explicit) return { kind: explicit.kind, entry: explicit };
  const dayName = DAY_NAMES[date.getDay()];
  return operatingDays.includes(dayName) ? { kind: "open" } : { kind: "closed" };
}

export default async function CalendarPage() {
  const state = await getSiteState();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dateKey(today);

  // 4 weeks starting from this week's Sunday
  const gridStart = startOfWeek(today);
  const cells = Array.from({ length: 28 }, (_, i) => addDays(gridStart, i));
  const gridEnd = cells[cells.length - 1];

  // Month label: show first cell's month, plus the second month if the grid crosses
  let monthLabel = `${MONTHS[gridStart.getMonth()]} ${gridStart.getFullYear()}`;
  if (gridStart.getMonth() !== gridEnd.getMonth()) {
    monthLabel = `${MONTHS[gridStart.getMonth()]} – ${MONTHS[gridEnd.getMonth()]} ${gridEnd.getFullYear()}`;
  }

  const cateringDays = state.calendar
    .filter((e) => e.kind === "catering")
    .filter((e) => e.date >= dateKey(today))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-10 sm:mb-14">
        <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
          The calendar
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05]">
          Where we are.<br />
          <em className="text-(--amber) not-italic">When we&apos;re booked.</em>
        </h1>
        <p className="mt-5 text-(--text-soft) max-w-xl">
          Regular service is {state.hours.open}–{state.hours.close}. If we&apos;re
          catering, you&apos;ll see who for — that way you know to book ahead, and
          you know who&apos;s lucky enough to be feeding their team that day.
        </p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <span className="text-(--text)">
            {SETTINGS.location.venue} · {SETTINGS.location.street}, {SETTINGS.location.cityState}
          </span>
          <a
            href={SETTINGS.location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--amber) hover:text-(--text) font-medium transition-colors"
          >
            Get directions →
          </a>
        </div>
      </header>

      {/* Month label + legend */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4 sm:mb-5">
        <h2 className="font-serif text-2xl sm:text-3xl text-(--text)">
          {monthLabel}
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <LegendDot color="open" label="Open" />
          <LegendDot color="catering" label="Catering" />
          <LegendDot color="closed" label="Closed" />
        </div>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1.5 sm:mb-2">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-(--text-muted) text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((d) => {
          const key = dateKey(d);
          const isPast = key < todayKey;
          const isToday = key === todayKey;
          const { kind, entry } = deriveDayKind(d, state.calendar, state.hours.days);

          const kindStyle = isPast
            ? "bg-(--bg-card)/30 border-(--color-line)/30"
            : kind === "catering"
            ? "bg-(--amber)/12 border-(--amber)/45"
            : kind === "open"
            ? "bg-(--open)/10 border-(--open)/35"
            : "bg-black/40 border-(--color-line)/50 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_5px,rgba(255,255,255,0.04)_5px,rgba(255,255,255,0.04)_7px)]";

          const numberColor = isPast
            ? "text-(--text-muted)"
            : kind === "catering"
            ? "text-(--amber)"
            : kind === "closed"
            ? "text-(--text-muted)/60"
            : "text-(--text)";

          return (
            <div
              key={key}
              className={`relative aspect-square sm:aspect-[5/4] rounded-md sm:rounded-lg border p-1.5 sm:p-2.5 overflow-hidden transition-colors ${kindStyle} ${
                isToday ? "ring-2 ring-(--amber) ring-offset-2 ring-offset-(--bg)" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className={`font-serif text-base sm:text-xl leading-none ${numberColor}`}>
                  {d.getDate()}
                </span>
                {kind !== "open" && (
                  <span
                    aria-hidden="true"
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 sm:mt-2 ${
                      kind === "catering" ? "bg-(--amber)" : "bg-(--text-muted)"
                    }`}
                  />
                )}
              </div>

              {/* Today label */}
              {isToday && (
                <div className="hidden sm:block absolute top-1.5 right-2 text-[9px] uppercase tracking-[0.15em] text-(--amber) font-semibold">
                  Today
                </div>
              )}

              {/* Catering client label — desktop only */}
              {kind === "catering" && entry?.client && (
                <div className="hidden sm:block absolute bottom-1.5 left-2 right-2 text-[10px] text-(--amber)/90 leading-tight line-clamp-2">
                  {entry.client.split(" — ")[0]}
                </div>
              )}

              {/* Closed note — desktop only */}
              {kind === "closed" && entry?.note && (
                <div className="hidden sm:block absolute bottom-1.5 left-2 right-2 text-[10px] text-(--text-muted) italic line-clamp-2">
                  {entry.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming catering call-out (mobile-friendly detail since mobile cells hide client names) */}
      {cateringDays.length > 0 && (
        <section className="mt-10 sm:mt-14">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-4">
            Booked catering ahead
          </p>
          <ul className="space-y-2">
            {cateringDays.map((e) => {
              const d = new Date(e.date + "T12:00");
              return (
                <li
                  key={e.date}
                  className="flex items-baseline gap-4 bg-(--amber)/8 border border-(--amber)/30 rounded-lg px-4 py-3"
                >
                  <div className="font-serif text-(--amber) text-lg shrink-0 w-20">
                    {DAY_NAMES[d.getDay()]} {d.getDate()}
                  </div>
                  <div className="text-sm text-(--text) flex-1 min-w-0">
                    {e.client}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-12 bg-(--bg-card) border border-(--color-line) rounded-2xl p-7">
        <div className="font-serif text-xl text-(--text) mb-2">Want us at your spot?</div>
        <p className="text-(--text-soft) text-sm mb-4">
          Catering days come out of the regular schedule — book early so you can
          claim one before someone else does.
        </p>
        <a
          href="/catering"
          className="inline-block bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide"
        >
          Book catering
        </a>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: "open" | "catering" | "closed"; label: string }) {
  const dotClass =
    color === "open"
      ? "bg-(--open)/30 border border-(--open)/45"
      : color === "catering"
      ? "bg-(--amber)/30 border border-(--amber)/45"
      : "bg-black/40 border border-(--color-line)/50";
  return (
    <span className="flex items-center gap-1.5 text-(--text-soft)">
      <span className={`w-3 h-3 rounded-sm ${dotClass}`} />
      {label}
    </span>
  );
}
