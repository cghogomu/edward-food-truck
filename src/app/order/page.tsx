"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, expandLine, modifierLabels } from "@/lib/cart";
import { isDeliverable, DELIVERY_ZIPS } from "@/content/zips";
import { SETTINGS } from "@/content/settings";
import { DeliveryAreaMap } from "@/components/DeliveryAreaMap";

type Mode = "pickup" | "delivery";

export default function OrderPage() {
  const { lines, hydrated, updateQty, remove, itemCount, subtotal } = useCart();
  const [mode, setMode] = useState<Mode>("pickup");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [pickupTime, setPickupTime] = useState("asap");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const tax = subtotal * SETTINGS.ordering.salesTaxRate;
  const deliveryFee =
    mode === "delivery" && !SETTINGS.ordering.deliveryFeePromoActive
      ? SETTINGS.ordering.deliveryFee
      : 0;
  const processing = lines.length > 0 ? SETTINGS.ordering.stripeFeePassThrough : 0;
  const total = subtotal + tax + deliveryFee + processing;

  const zipValid = zip.length === 0 || isDeliverable(zip);
  const canCheckout =
    lines.length > 0 &&
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    (mode === "pickup" ||
      (address.trim().length > 0 && zip.trim().length === 5 && zipValid));

  if (!hydrated) {
    return <div className="max-w-3xl mx-auto px-5 py-20 text-(--text-soft)">Loading your order…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <header className="mb-8">
        <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
          Your order
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          {itemCount === 0 ? "Cart's empty" : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        </h1>
      </header>

      {lines.length === 0 ? (
        <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-10 text-center">
          <p className="text-(--text-soft) mb-6">Nothing in the cart yet.</p>
          <Link
            href="/menu"
            className="inline-block bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide"
          >
            See the menu
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Line items */}
          <section className="bg-(--bg-card) border border-(--color-line) rounded-2xl overflow-hidden">
            {lines.map((line, i) => {
              const { item, lineTotal } = expandLine(line);
              if (!item) return null;
              const mods = modifierLabels(line);
              return (
                <div
                  key={i}
                  className="flex gap-4 p-4 sm:p-5 border-b border-(--color-line) last:border-b-0"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <div className="font-serif text-lg text-(--text) truncate">{item.name}</div>
                      <div className="text-(--amber) font-medium whitespace-nowrap">${lineTotal.toFixed(2)}</div>
                    </div>
                    {mods.length > 0 && (
                      <div className="text-xs text-(--text-soft) mb-1">{mods.join(" · ")}</div>
                    )}
                    {line.note && (
                      <div className="text-xs text-(--text-muted) italic mb-2">"{line.note}"</div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-(--bg) border border-(--color-line) rounded-md">
                        <button
                          onClick={() => updateQty(i, line.qty - 1)}
                          className="w-8 h-8 text-(--text-soft) hover:text-(--text)"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{line.qty}</span>
                        <button
                          onClick={() => updateQty(i, line.qty + 1)}
                          className="w-8 h-8 text-(--text-soft) hover:text-(--text)"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i)}
                        className="text-xs text-(--text-muted) hover:text-(--closed)"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Pickup vs delivery */}
          <section>
            <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
              How you want it
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["pickup", "delivery"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === m
                      ? "border-(--amber) bg-(--amber)/10"
                      : "border-(--color-line) bg-(--bg-card) hover:bg-(--bg-card-hover)"
                  }`}
                >
                  <div className="font-serif text-lg capitalize text-(--text)">{m}</div>
                  <div className="text-xs text-(--text-soft) mt-1">
                    {m === "pickup" ? "At the truck" : SETTINGS.ordering.deliveryFeePromoActive ? "Free, limited time" : `$${SETTINGS.ordering.deliveryFee}`}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Pickup time */}
          {mode === "pickup" && (
            <section>
              <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
                Pickup time
              </div>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-(--bg-card) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) focus:border-(--amber) outline-hidden"
              >
                <option value="asap">As soon as possible (~15 min)</option>
                <option value="30">In 30 minutes</option>
                <option value="45">In 45 minutes</option>
                <option value="60">In an hour</option>
              </select>
            </section>
          )}

          {/* Delivery details */}
          {mode === "delivery" && (
            <section className="space-y-3">
              <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber)">
                Delivery details
              </div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apt/unit"
                className="w-full bg-(--bg-card) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
              />
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="ZIP code (Austin)"
                inputMode="numeric"
                className={`w-full bg-(--bg-card) border rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) outline-hidden ${
                  zipValid ? "border-(--color-line) focus:border-(--amber)" : "border-(--closed)"
                }`}
              />
              {!zipValid && zip.length === 5 && (
                <p className="text-xs text-(--closed)">
                  Sorry — that ZIP is outside our current delivery zone.{" "}
                  <button
                    type="button"
                    onClick={() => setMode("pickup")}
                    className="underline hover:text-(--text)"
                  >
                    Switch to pickup?
                  </button>
                </p>
              )}
              <p className="text-xs text-(--text-muted)">
                Currently delivering to {DELIVERY_ZIPS.size} ZIP codes across
                north Austin, Pflugerville, and Round Rock.
              </p>
              <div className="pt-2">
                <DeliveryAreaMap />
              </div>
            </section>
          )}

          {/* Contact */}
          <section className="space-y-3">
            <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber)">
              Contact
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-(--bg-card) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (for order updates)"
              type="tel"
              className="w-full bg-(--bg-card) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else? (optional)"
              className="w-full bg-(--bg-card) border border-(--color-line) rounded-lg px-4 py-3 text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden resize-none"
              rows={2}
            />
          </section>

          {mode === "delivery" && (
            <div className="bg-(--amber)/10 border border-(--amber)/30 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-2">
                Heads up
              </div>
              <p className="text-sm text-(--text)">
                Edward delivers personally. Tips are appreciated and go directly to him —
                you'll get a chance to add one at the door.
              </p>
            </div>
          )}

          {/* Totals */}
          <section className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-5 sm:p-6">
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={subtotal} />
              <Row label="Sales tax (8.25%)" value={tax} />
              {mode === "delivery" && SETTINGS.ordering.deliveryFeePromoActive && (
                <div className="flex justify-between text-(--open)">
                  <span>Delivery (free — limited time)</span>
                  <span className="line-through text-(--text-muted)">
                    ${SETTINGS.ordering.deliveryFee.toFixed(2)}
                  </span>
                </div>
              )}
              {mode === "delivery" && !SETTINGS.ordering.deliveryFeePromoActive && (
                <Row label="Delivery" value={deliveryFee} />
              )}
              <Row label="Processing fee" value={processing} />
              <div className="border-t border-(--color-line) pt-2 mt-3 flex justify-between text-(--text) text-base font-medium">
                <span>Total</span>
                <span className="text-(--amber) font-serif text-xl">${total.toFixed(2)}</span>
              </div>
            </div>

            {canCheckout ? (
              <a
                href={SETTINGS.ordering.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full text-center bg-(--russet) hover:bg-(--russet-deep) text-(--text) py-4 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors"
              >
                Order &amp; Pay Online · ${total.toFixed(2)}
              </a>
            ) : (
              <button
                disabled
                className="mt-6 w-full bg-(--bg) text-(--text-muted) py-4 rounded-lg text-sm font-semibold tracking-wide uppercase cursor-not-allowed"
              >
                {mode === "delivery"
                  ? "Add your details to continue"
                  : "Add your name & phone to continue"}
              </button>
            )}
            <p className="mt-3 text-xs text-(--text-muted) text-center">
              You'll finish payment on our secure payment page.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-(--text-soft)">
      <span>{label}</span>
      <span className="text-(--text)">${value.toFixed(2)}</span>
    </div>
  );
}
