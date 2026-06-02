"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

export function CartIndicator() {
  const { itemCount, subtotal, hydrated } = useCart();
  const pathname = usePathname();

  // Don't render until client hydrates (otherwise SSR shows empty)
  if (!hydrated) return null;
  if (itemCount === 0) return null;

  // Hide on order pages (the cart IS the page there)
  if (pathname.startsWith("/order")) return null;

  // Hide inside the dashboard
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <div
      className="fixed inset-x-0 z-30 px-4 pointer-events-none"
      style={{
        bottom: "calc(64px + env(safe-area-inset-bottom))",
      }}
    >
      <Link
        href="/order"
        className="md:max-w-md md:mx-auto pointer-events-auto mx-auto flex items-center justify-between gap-3 bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-5 py-3.5 rounded-full shadow-2xl shadow-black/40 border border-(--russet-deep) transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center min-w-7 h-7 rounded-full bg-(--bg) text-(--amber) text-sm font-bold px-2">
            {itemCount}
          </span>
          <span className="text-sm font-semibold uppercase tracking-wide">
            View cart
          </span>
        </span>
        <span className="font-serif text-lg">${subtotal.toFixed(2)}</span>
      </Link>
    </div>
  );
}
