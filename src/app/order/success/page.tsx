"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type LastOrder = {
  orderNumber: string;
  mode: "pickup" | "delivery";
  total: number;
  name: string;
  pickupTime: string;
};

const STORAGE_KEY = "iron-oaks-last-order";
const CART_KEY = "iron-oaks-cart-v1";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<SuccessShell order={null} />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // If we came back from Stripe Checkout, trust the session over local storage.
    if (sessionId) {
      let cancelled = false;
      fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data?.configured && data?.paid) {
            const next: LastOrder = {
              orderNumber: data.orderNumber ?? "",
              mode: (data.mode as LastOrder["mode"]) ?? "pickup",
              total: typeof data.total === "number" ? data.total : 0,
              name: data.name ?? "",
              pickupTime: data.pickupTime ?? "",
            };
            setOrder(next);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            try {
              window.localStorage.removeItem(CART_KEY);
              window.dispatchEvent(new CustomEvent("iron-oaks-cart"));
            } catch {}
            return;
          }
          const raw = sessionStorage.getItem(STORAGE_KEY);
          if (raw) setOrder(JSON.parse(raw));
        })
        .catch(() => {
          const raw = sessionStorage.getItem(STORAGE_KEY);
          if (raw) setOrder(JSON.parse(raw));
        });
      return () => {
        cancelled = true;
      };
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) setOrder(JSON.parse(raw));
  }, [sessionId]);

  return <SuccessShell order={order} />;
}

function SuccessShell({ order }: { order: LastOrder | null }) {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center">
      <div className="inline-flex w-16 h-16 rounded-full bg-(--open)/15 border border-(--open)/30 items-center justify-center mb-7">
        <span className="text-(--open) text-3xl">✓</span>
      </div>
      <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-3">
        Order received
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-5">
        Thanks{order?.name ? `, ${order.name}` : ""}.<br />
        <em className="text-(--text-soft) not-italic">It's on the smoke.</em>
      </h1>

      {order && (
        <div className="mt-10 bg-(--bg-card) border border-(--color-line) rounded-2xl p-7 text-left max-w-md mx-auto">
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-2">
            Order
          </div>
          <div className="font-serif text-2xl text-(--text) mb-5">
            {order.orderNumber}
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-(--text-soft)">Total charged</dt>
              <dd className="text-(--amber) font-medium">${order.total.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-(--text-soft)">{order.mode === "pickup" ? "Pickup" : "Delivery"}</dt>
              <dd className="text-(--text) capitalize">
                {order.mode === "pickup"
                  ? order.pickupTime === "asap"
                    ? "ASAP"
                    : `In ${order.pickupTime} min`
                  : "On its way"}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {order?.mode === "delivery" && (
        <div className="mt-7 bg-(--amber)/10 border border-(--amber)/30 rounded-2xl p-6 max-w-md mx-auto text-left">
          <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-2">
            Tip the driver
          </div>
          <p className="text-(--text) text-sm leading-relaxed">
            Edward delivers Iron Oaks orders himself. Tips go straight to him —
            cash at the door or via Venmo/Zelle on arrival. Appreciated, never expected.
          </p>
        </div>
      )}

      <p className="mt-10 text-(--text-muted) text-sm">
        Confirmation email on the way. Questions? Reach Edward at (512) 555-0123.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="text-(--amber) hover:text-(--text) text-sm font-medium"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
