"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function HeaderOrderButton() {
  const { itemCount, hydrated } = useCart();
  const showBadge = hydrated && itemCount > 0;

  return (
    <Link
      href="/order"
      className="hidden md:inline-flex relative items-center bg-(--russet) hover:bg-(--russet-deep) text-(--text) text-sm font-medium px-4 py-2 rounded transition-colors"
    >
      Order
      {showBadge && (
        <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-(--amber) text-(--bg) text-[11px] font-bold leading-none border-2 border-(--bg)">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
