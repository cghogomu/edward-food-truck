"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteState, ServicePeriod, CalendarEntry } from "@/types";

const PASS_KEY = "iron-oaks-dashboard-auth";
const DEMO_PASSWORD = "ironoaks";

export default function DashboardPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [state, setState] = useState<SiteState | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAuthed(sessionStorage.getItem(PASS_KEY) === "ok");
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/state", { cache: "no-store" })
      .then((r) => r.json())
      .then((s: SiteState) => setState(s));
  }, [authed]);

  async function patch(p: Partial<SiteState>) {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const next = (await res.json()) as SiteState;
    setState(next);
    router.refresh();
  }

  if (authed === null) {
    return <div className="max-w-md mx-auto px-5 py-20 text-(--text-soft)">Loading…</div>;
  }

  if (!authed) {
    return <LoginGate onSuccess={() => setAuthed(true)} />;
  }

  if (!state) {
    return <div className="max-w-md mx-auto px-5 py-20 text-(--text-soft)">Loading dashboard…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-2">
            Truck Dashboard
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-(--text)">
            Today&apos;s controls.
          </h1>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(PASS_KEY);
            setAuthed(false);
          }}
          className="text-xs text-(--text-muted) hover:text-(--text)"
        >
          Sign out
        </button>
      </header>

      {/* One card per service window. Lunch and evening run independently —
          selling out at lunch leaves the evening's portions alone. */}
      {state.services.map((service) => (
        <ServiceControls
          key={service.id}
          service={service}
          onPatch={(changes) =>
            patch({
              services: state.services.map((s) =>
                s.id === service.id ? { ...s, ...changes } : s
              ),
            })
          }
        />
      ))}

      {/* Free delivery offer — drives the home-page headline and the delivery
          card on "How to order". Off puts the brand line back in the hero. */}
      <SimpleToggle
        title="Free delivery offer"
        description="Headlines the home page and marks delivery as free on the order page. Turn off when you start charging."
        value={state.freeDeliveryBanner}
        onChange={(v) => patch({ freeDeliveryBanner: v })}
      />

      {/* Calendar */}
      <CalendarControls state={state} onPatch={patch} />

      <p className="mt-12 text-xs text-(--text-muted) text-center">
        Concept demo · changes save instantly, visible site-wide on refresh.
      </p>
    </div>
  );
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-3 text-center">
        Iron Oaks · Truck Dashboard
      </p>
      <h1 className="font-serif text-3xl text-(--text) text-center mb-2">
        Sign in.
      </h1>
      <p className="text-(--text-soft) text-sm text-center mb-8">
        Demo password: <code className="text-(--amber)">{DEMO_PASSWORD}</code>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === DEMO_PASSWORD) {
            sessionStorage.setItem(PASS_KEY, "ok");
            onSuccess();
          } else {
            setErr(true);
          }
        }}
        className="space-y-3"
      >
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr(false);
          }}
          placeholder="Password"
          className={`w-full bg-(--bg-card) border rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden ${
            err ? "border-(--closed)" : "border-(--color-line)"
          }`}
        />
        <button
          type="submit"
          className="w-full bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-3 rounded-lg text-sm font-semibold uppercase tracking-wide"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

// Day keys must match the `weekday: "short"` values `truckNow()` produces in
// en-US, since deriveOpenStatus compares them directly against a period's days.
const DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Everything for one service window: its portions and its hours. Lunch and
 * evening each get their own card, and nothing here touches the other one.
 */
function ServiceControls({
  service,
  onPatch,
}: {
  service: ServicePeriod;
  onPatch: (changes: Partial<ServicePeriod>) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const isSoldOut = service.soldOut || service.inventory.today <= 0;
  const isLow =
    !isSoldOut &&
    service.inventory.today <= Math.ceil(service.inventory.max * 0.25);
  const running = service.days.length > 0;

  async function run(changes: Partial<ServicePeriod>) {
    setBusy(true);
    await onPatch(changes);
    setBusy(false);
  }

  return (
    <section className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6 mb-5">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber)">
            {service.label}
          </div>
          <div className="text-(--text-muted) text-xs mt-1">
            {running
              ? `${service.open}–${service.close} · ${service.days.length} day${
                  service.days.length === 1 ? "" : "s"
                }`
              : "Not running — pick days below"}
          </div>
        </div>
        <div
          className={`text-xs uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-full border ${
            !running
              ? "text-(--text-muted) bg-(--bg) border-(--color-line)"
              : isSoldOut
              ? "text-(--closed) bg-(--closed)/10 border-(--closed)/30"
              : isLow
              ? "text-(--amber) bg-(--amber)/10 border-(--amber)/30"
              : "text-(--open) bg-(--open)/10 border-(--open)/30"
          }`}
        >
          {!running ? "Off" : isSoldOut ? "Sold out" : isLow ? "Almost gone" : "Open"}
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 mb-5">
        <div>
          <div className="font-serif text-5xl text-(--text) leading-none">
            {service.inventory.today}
          </div>
          <div className="text-(--text-soft) text-sm mt-2">
            of {service.inventory.max} portions left
          </div>
        </div>
      </div>

      <button
        onClick={() =>
          isSoldOut
            ? run({
                soldOut: false,
                inventory: { ...service.inventory, today: service.inventory.max },
              })
            : run({
                soldOut: true,
                inventory: { ...service.inventory, today: 0 },
              })
        }
        disabled={busy}
        className={`w-full py-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-colors mb-3 ${
          isSoldOut
            ? "bg-(--open)/20 hover:bg-(--open)/30 text-(--open) border border-(--open)/40"
            : "bg-(--closed) hover:bg-(--closed-deep) text-(--text)"
        } disabled:opacity-50`}
      >
        {isSoldOut
          ? `Re-open ${service.label} · reset to full`
          : `Mark ${service.label} sold out`}
      </button>

      <details className="text-sm">
        <summary className="cursor-pointer text-(--text-soft) hover:text-(--text) py-2">
          Adjust {service.label.toLowerCase()} portions &amp; hours
        </summary>

        <PortionFields service={service} busy={busy} onApply={run} />
        <HoursFields service={service} busy={busy} onApply={run} />
      </details>
    </section>
  );
}

function PortionFields({
  service,
  busy,
  onApply,
}: {
  service: ServicePeriod;
  busy: boolean;
  onApply: (changes: Partial<ServicePeriod>) => Promise<void>;
}) {
  const [today, setToday] = useState(service.inventory.today);
  const [max, setMax] = useState(service.inventory.max);

  const dirty =
    today !== service.inventory.today || max !== service.inventory.max;

  return (
    <div className="mt-3 pb-5 border-b border-(--color-line)">
      <div className="text-xs text-(--text-muted) uppercase tracking-wider mb-2">
        Portions
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-(--text-muted)">Left now</span>
          <input
            type="number"
            value={today}
            onChange={(e) => setToday(Math.max(0, Number(e.target.value)))}
            className="w-full mt-1 bg-(--bg) border border-(--color-line) rounded-lg px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden"
          />
        </label>
        <label className="block">
          <span className="text-xs text-(--text-muted)">Batch size</span>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Math.max(1, Number(e.target.value)))}
            className="w-full mt-1 bg-(--bg) border border-(--color-line) rounded-lg px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden"
          />
        </label>
        <button
          onClick={() =>
            onApply({ inventory: { today, max }, soldOut: today <= 0 })
          }
          disabled={busy || !dirty}
          className="col-span-2 bg-(--bg) border border-(--color-line) hover:border-(--amber) text-(--text) py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Save portions
        </button>
      </div>
    </div>
  );
}

function HoursFields({
  service,
  busy,
  onApply,
}: {
  service: ServicePeriod;
  busy: boolean;
  onApply: (changes: Partial<ServicePeriod>) => Promise<void>;
}) {
  const [open, setOpen] = useState(service.open);
  const [close, setClose] = useState(service.close);
  const [days, setDays] = useState<string[]>(service.days);

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  // The open/closed check compares plain minute values, so a closing time that
  // wraps past midnight would read as "closed all day". Block it rather than
  // let Edward save hours that silently hide a service.
  const wrapsMidnight = toMinutes(close) <= toMinutes(open);

  const dirty =
    open !== service.open ||
    close !== service.close ||
    days.join() !== service.days.join();

  function toggleDay(day: string) {
    setDays((d) =>
      d.includes(day)
        ? d.filter((x) => x !== day)
        : DAY_KEYS.filter((k) => k === day || d.includes(k))
    );
  }

  return (
    <div className="mt-4">
      <div className="text-xs text-(--text-muted) uppercase tracking-wider mb-2">
        Hours · Austin time
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="block">
          <span className="text-xs text-(--text-muted)">Opens</span>
          <input
            type="time"
            value={open}
            onChange={(e) => setOpen(e.target.value)}
            className="w-full mt-1 bg-(--bg) border border-(--color-line) rounded-lg px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden"
          />
        </label>
        <label className="block">
          <span className="text-xs text-(--text-muted)">Closes</span>
          <input
            type="time"
            value={close}
            onChange={(e) => setClose(e.target.value)}
            className="w-full mt-1 bg-(--bg) border border-(--color-line) rounded-lg px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden"
          />
        </label>
      </div>

      <div className="text-xs text-(--text-muted) uppercase tracking-wider mb-2">
        Days
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {DAY_KEYS.map((day) => {
          const on = days.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              aria-pressed={on}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                on
                  ? "bg-(--amber)/15 text-(--amber) border-(--amber)/40"
                  : "bg-(--bg) text-(--text-muted) border-(--color-line) hover:text-(--text)"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {wrapsMidnight && (
        <p className="text-(--closed) text-sm mb-3">
          Closing time must be later than opening time. Hours running past
          midnight aren&apos;t supported yet.
        </p>
      )}
      {days.length === 0 && !wrapsMidnight && (
        <p className="text-(--text-muted) text-sm mb-3">
          No days selected — this service won&apos;t run at all.
        </p>
      )}

      <button
        onClick={() => onApply({ open, close, days })}
        disabled={busy || wrapsMidnight || !dirty}
        className="w-full bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors disabled:opacity-50"
      >
        Save hours
      </button>
    </div>
  );
}

function SimpleToggle({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <section className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-5 mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="font-medium text-(--text)">{title}</div>
        <div className="text-(--text-soft) text-sm mt-1">{description}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative shrink-0 w-12 h-7 rounded-full transition-colors ${
          value ? "bg-(--amber)" : "bg-(--bg)"
        } border ${value ? "border-(--amber)" : "border-(--color-line)"}`}
        aria-pressed={value}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-(--text) transition-all ${
            value ? "left-6" : "left-0.5"
          }`}
        />
      </button>
    </section>
  );
}

function CalendarControls({
  state,
  onPatch,
}: {
  state: SiteState;
  onPatch: (p: Partial<SiteState>) => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [kind, setKind] = useState<CalendarEntry["kind"]>("catering");
  const [client, setClient] = useState("");
  const [note, setNote] = useState("");

  const upcoming = [...state.calendar]
    .filter((e) => e.kind !== "open")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  async function addEntry() {
    if (!date) return;
    const entry: CalendarEntry = {
      date,
      kind,
      ...(kind === "catering" && client ? { client } : {}),
      ...(kind === "closed" && note ? { note } : {}),
    };
    const filtered = state.calendar.filter((e) => e.date !== date);
    await onPatch({ calendar: [...filtered, entry] });
    setDate("");
    setClient("");
    setNote("");
    setShowForm(false);
  }

  async function removeEntry(d: string) {
    await onPatch({ calendar: state.calendar.filter((e) => e.date !== d) });
  }

  return (
    <section className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber)">
            Upcoming catering &amp; closures
          </div>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs text-(--amber) hover:text-(--text) uppercase tracking-wider font-semibold"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <div className="bg-(--bg) border border-(--color-line) rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-(--bg-card) border border-(--color-line) rounded px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden text-sm"
            />
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as CalendarEntry["kind"])}
              className="bg-(--bg-card) border border-(--color-line) rounded px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden text-sm"
            >
              <option value="catering">Catering</option>
              <option value="closed">Closed</option>
              <option value="open">Open (override)</option>
            </select>
          </div>
          {kind === "catering" && (
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Client name (shown publicly)"
              className="w-full bg-(--bg-card) border border-(--color-line) rounded px-3 py-2 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden text-sm"
            />
          )}
          {kind === "closed" && (
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason (optional, shown publicly)"
              className="w-full bg-(--bg-card) border border-(--color-line) rounded px-3 py-2 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden text-sm"
            />
          )}
          <button
            onClick={addEntry}
            disabled={!date}
            className="w-full bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-2.5 rounded text-sm font-semibold uppercase tracking-wide disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}

      <ul className="space-y-2">
        {upcoming.length === 0 && (
          <li className="text-(--text-muted) text-sm py-2">No upcoming entries.</li>
        )}
        {upcoming.map((e) => (
          <li
            key={e.date}
            className="flex items-center justify-between gap-3 bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3"
          >
            <div className="min-w-0">
              <div className="text-sm text-(--text)">
                {new Date(e.date + "T12:00").toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                <span className={`ml-2 text-xs uppercase tracking-wider ${e.kind === "catering" ? "text-(--amber)" : "text-(--text-muted)"}`}>
                  · {e.kind}
                </span>
              </div>
              {e.client && (
                <div className="text-xs text-(--text-soft) truncate">{e.client}</div>
              )}
              {e.note && (
                <div className="text-xs text-(--text-soft) italic truncate">{e.note}</div>
              )}
            </div>
            <button
              onClick={() => removeEntry(e.date)}
              className="text-xs text-(--text-muted) hover:text-(--closed) shrink-0"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
