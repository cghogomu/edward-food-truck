"use client";

import { useState } from "react";
import { SETTINGS } from "@/content/settings";

const SMALL_BUNDLE = {
  price: 17,
  includes: [
    "Pick any item on the menu — guests choose their own",
    "Plates, napkins, utensils",
    "Set up and breakdown handled by Edward",
  ],
};

export default function CateringPage() {
  const [headcount, setHeadcount] = useState(40);
  const isLarge = headcount > SETTINGS.ordering.cateringSmallThreshold;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-12 sm:mb-16 text-center">
        <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-4">
          Catering
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] mb-6">
          Bring Iron Oaks<br />
          <em className="text-(--amber) not-italic">to your people.</em>
        </h1>
        <p className="text-(--text-soft) text-lg leading-relaxed max-w-2xl mx-auto">
          Office lunches, team dinners, neighborhood block parties — anywhere
          worth feeding well. Two ways to book, depending on the size.
        </p>
      </header>

      {/* Headcount picker */}
      <section className="mb-12 bg-(--bg-card) border border-(--color-line) rounded-2xl p-7 sm:p-9">
        <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
          How many people?
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-serif text-5xl sm:text-7xl text-(--text)">
              {headcount}
            </div>
            <div className="text-(--text-soft) text-sm mt-1">
              {isLarge ? "We'll quote you custom." : "Self-serve bundle pricing below."}
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={headcount}
            onChange={(e) => setHeadcount(Number(e.target.value))}
            className="w-full sm:w-80 accent-(--amber)"
          />
        </div>
      </section>

      {/* Under 60 — flat rate */}
      {!isLarge && (
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-2">
              Under 60 — flat rate
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">
              One price. Any group.<br />
              <em className="text-(--text-soft) not-italic">Done in two minutes.</em>
            </h2>
          </div>

          <div className="bg-(--bg-card) border border-(--amber)/40 rounded-2xl p-7 sm:p-10 mb-8 flex flex-col sm:flex-row sm:items-center gap-7 sm:gap-10">
            <div className="shrink-0">
              <div className="font-serif text-6xl sm:text-7xl text-(--amber) leading-none">
                ${SMALL_BUNDLE.price}
              </div>
              <div className="text-sm text-(--text-soft) mt-2">
                per person · flat rate
              </div>
            </div>
            <ul className="space-y-2 text-(--text-soft) text-sm sm:text-base">
              {SMALL_BUNDLE.includes.map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-(--amber) shrink-0">·</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <SmallBundleForm headcount={headcount} />
        </section>
      )}

      {/* 60+ — hybrid quote flow */}
      {isLarge && (
        <section className="mb-14">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-2">
              60 and over — we&apos;ll quote you
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Tell me a little.<br />
              <em className="text-(--text-soft) not-italic">Then let&apos;s talk.</em>
            </h2>
            <p className="mt-4 text-(--text-soft) max-w-2xl">
              Bigger groups mean I bring on extra help and put down a grocery
              deposit, so pricing is custom. Fill out the short form below, then
              pick a time for a 15-minute call — I&apos;ll quote you on the spot.
            </p>
          </div>

          <LargeQuoteFlow headcount={headcount} />
        </section>
      )}
    </div>
  );
}

function SmallBundleForm({ headcount }: { headcount: number }) {
  const [submitted, setSubmitted] = useState(false);
  if (submitted) {
    return (
      <div className="bg-(--open)/10 border border-(--open)/30 rounded-2xl p-7 text-center">
        <p className="font-serif text-2xl text-(--text) mb-2">
          Request sent. I&apos;ll confirm within a day.
        </p>
        <p className="text-(--text-soft) text-sm">
          Catering inquiries route to my regular email — I check it daily.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-7 grid sm:grid-cols-2 gap-4"
    >
      <input
        required
        placeholder="Name"
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
      />
      <input
        required
        type="email"
        placeholder="Email"
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
      />
      <input
        required
        type="date"
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) focus:border-(--amber) outline-hidden"
      />
      <input
        readOnly
        value={`${headcount} people`}
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text-soft)"
      />
      <textarea
        placeholder="Anything to flag? (allergies, location, time, dietary mix)"
        className="sm:col-span-2 bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden resize-none"
        rows={3}
      />
      <button
        type="submit"
        className="sm:col-span-2 bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-4 rounded-lg text-sm font-semibold tracking-wide uppercase"
      >
        Request this date
      </button>
    </form>
  );
}

function LargeQuoteFlow({ headcount }: { headcount: number }) {
  const [step, setStep] = useState<"form" | "schedule">("form");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    date: "",
    location: "",
    dietary: "",
  });

  if (step === "schedule") {
    return (
      <div className="space-y-6">
        <div className="bg-(--open)/10 border border-(--open)/30 rounded-2xl p-5">
          <p className="text-(--text) font-medium">
            Got it, {details.name}. Now pick a time to talk:
          </p>
        </div>
        <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-10 text-center">
          <div className="inline-block bg-(--bg) border border-(--color-line) rounded-lg px-5 py-3 text-xs text-(--text-muted) uppercase tracking-wider mb-5">
            Scheduling embed placeholder
          </div>
          <p className="font-serif text-2xl text-(--text) mb-3">
            Calendly will live here.
          </p>
          <p className="text-(--text-soft) text-sm max-w-md mx-auto">
            Once Edward connects a Calendly account, the booking widget shows up
            in this slot. Customer picks a 15-minute call slot, Edward gets the
            event in his calendar with all the answers above pre-filled in the
            notes.
          </p>
          <button
            onClick={() => setStep("form")}
            className="mt-7 text-(--amber) text-sm hover:text-(--text)"
          >
            ← Back to the form
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStep("schedule");
      }}
      className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-7 sm:p-8 grid sm:grid-cols-2 gap-4"
    >
      <div className="sm:col-span-2 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.18em] font-semibold text-(--text-muted) mb-2">
        <div>
          <span className="text-(--amber)">Step 1</span> · Tell me about it
        </div>
        <div className="text-right opacity-50">
          Step 2 · Pick a time
        </div>
      </div>
      <input
        required
        value={details.name}
        onChange={(e) => setDetails({ ...details, name: e.target.value })}
        placeholder="Your name"
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
      />
      <input
        required
        type="email"
        value={details.email}
        onChange={(e) => setDetails({ ...details, email: e.target.value })}
        placeholder="Email"
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
      />
      <input
        required
        type="date"
        value={details.date}
        onChange={(e) => setDetails({ ...details, date: e.target.value })}
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) focus:border-(--amber) outline-hidden"
      />
      <input
        readOnly
        value={`${headcount} people`}
        className="bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text-soft)"
      />
      <input
        required
        value={details.location}
        onChange={(e) => setDetails({ ...details, location: e.target.value })}
        placeholder="Where (address or area)"
        className="sm:col-span-2 bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
      />
      <textarea
        value={details.dietary}
        onChange={(e) => setDetails({ ...details, dietary: e.target.value })}
        placeholder="Dietary mix, vegetarians, allergies, anything to flag"
        className="sm:col-span-2 bg-(--bg) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden resize-none"
        rows={3}
      />
      <button
        type="submit"
        className="sm:col-span-2 bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-4 rounded-lg text-sm font-semibold tracking-wide uppercase"
      >
        Next · pick a time to talk →
      </button>
    </form>
  );
}
