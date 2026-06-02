"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteState, CalendarEntry } from "@/types";

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

      {/* Inventory — the headline action */}
      <InventoryControls state={state} onPatch={patch} />

      {/* Promo banner */}
      <SimpleToggle
        title="Free delivery banner"
        description="Shows the orange banner at the top of every page."
        value={state.freeDeliveryBanner}
        onChange={(v) => patch({ freeDeliveryBanner: v })}
      />

      {/* Calendar */}
      <CalendarControls state={state} onPatch={patch} />

      <p className="mt-12 text-xs text-(--text-muted) text-center">
        Concept demo · changes write to a local file, visible site-wide on refresh.
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

function InventoryControls({
  state,
  onPatch,
}: {
  state: SiteState;
  onPatch: (p: Partial<SiteState>) => Promise<void>;
}) {
  const [todayDraft, setTodayDraft] = useState(state.inventory.today);
  const [maxDraft, setMaxDraft] = useState(state.inventory.max);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTodayDraft(state.inventory.today);
    setMaxDraft(state.inventory.max);
  }, [state.inventory.today, state.inventory.max]);

  async function applyInventory() {
    setBusy(true);
    await onPatch({
      inventory: { today: todayDraft, max: maxDraft },
      soldOut: todayDraft <= 0,
    });
    setBusy(false);
  }

  async function markSoldOut() {
    setBusy(true);
    await onPatch({ soldOut: true, inventory: { ...state.inventory, today: 0 } });
    setBusy(false);
  }

  async function resetToMax() {
    setBusy(true);
    await onPatch({
      soldOut: false,
      inventory: { ...state.inventory, today: state.inventory.max },
    });
    setBusy(false);
  }

  const isSoldOut = state.soldOut || state.inventory.today <= 0;

  return (
    <section className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6 mb-5">
      <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
        Today&apos;s inventory
      </div>

      <div className="flex items-end justify-between gap-6 mb-6">
        <div>
          <div className="font-serif text-6xl text-(--text) leading-none">
            {state.inventory.today}
          </div>
          <div className="text-(--text-soft) text-sm mt-2">
            of {state.inventory.max} portions left
          </div>
        </div>
        <div
          className={`text-xs uppercase tracking-[0.18em] font-semibold px-3 py-1.5 rounded-full border ${
            isSoldOut
              ? "text-(--closed) bg-(--closed)/10 border-(--closed)/30"
              : state.inventory.today <= Math.ceil(state.inventory.max * 0.25)
              ? "text-(--amber) bg-(--amber)/10 border-(--amber)/30"
              : "text-(--open) bg-(--open)/10 border-(--open)/30"
          }`}
        >
          {isSoldOut ? "Sold out" : state.inventory.today <= Math.ceil(state.inventory.max * 0.25) ? "Almost gone" : "Open"}
        </div>
      </div>

      <button
        onClick={isSoldOut ? resetToMax : markSoldOut}
        disabled={busy}
        className={`w-full py-5 rounded-xl text-base font-semibold tracking-wide uppercase transition-colors mb-3 ${
          isSoldOut
            ? "bg-(--open)/20 hover:bg-(--open)/30 text-(--open) border border-(--open)/40"
            : "bg-(--closed) hover:bg-(--closed-deep) text-(--text)"
        } disabled:opacity-50`}
      >
        {isSoldOut ? "Re-open · reset to full" : "Mark sold out for today"}
      </button>

      <details className="text-sm">
        <summary className="cursor-pointer text-(--text-soft) hover:text-(--text) py-2">
          Adjust inventory manually
        </summary>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <label className="block">
            <span className="text-xs text-(--text-muted) uppercase tracking-wider">
              Left today
            </span>
            <input
              type="number"
              value={todayDraft}
              onChange={(e) => setTodayDraft(Math.max(0, Number(e.target.value)))}
              className="w-full mt-1 bg-(--bg) border border-(--color-line) rounded-lg px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden"
            />
          </label>
          <label className="block">
            <span className="text-xs text-(--text-muted) uppercase tracking-wider">
              Day&apos;s max
            </span>
            <input
              type="number"
              value={maxDraft}
              onChange={(e) => setMaxDraft(Math.max(1, Number(e.target.value)))}
              className="w-full mt-1 bg-(--bg) border border-(--color-line) rounded-lg px-3 py-2 text-(--text) focus:border-(--amber) outline-hidden"
            />
          </label>
          <button
            onClick={applyInventory}
            disabled={busy}
            className="col-span-2 bg-(--bg) border border-(--color-line) hover:border-(--amber) text-(--text) py-2.5 rounded-lg text-sm font-medium"
          >
            Apply
          </button>
        </div>
      </details>
    </section>
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
