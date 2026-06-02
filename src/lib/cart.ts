"use client";

import { useEffect, useState } from "react";
import type { CartLine, MenuItem } from "@/types";
import { MENU, findItem } from "@/content/menu";

const STORAGE_KEY = "iron-oaks-cart-v1";

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent("iron-oaks-cart"));
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readCart());
    setHydrated(true);
    const handler = () => setLines(readCart());
    window.addEventListener("iron-oaks-cart", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("iron-oaks-cart", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  function add(line: CartLine) {
    const next = [...lines, line];
    writeCart(next);
    setLines(next);
  }

  function updateQty(index: number, qty: number) {
    const next = lines.map((l, i) => (i === index ? { ...l, qty } : l)).filter((l) => l.qty > 0);
    writeCart(next);
    setLines(next);
  }

  function remove(index: number) {
    const next = lines.filter((_, i) => i !== index);
    writeCart(next);
    setLines(next);
  }

  function clear() {
    writeCart([]);
    setLines([]);
  }

  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, line) => {
    const item = findItem(line.itemId);
    if (!item) return sum;
    const modPrice = (item.modifiers ?? [])
      .filter((m) => line.modifierIds.includes(m.id))
      .reduce((s, m) => s + (m.price ?? 0), 0);
    return sum + (item.price + modPrice) * line.qty;
  }, 0);

  return { lines, hydrated, add, updateQty, remove, clear, itemCount, subtotal };
}

export function expandLine(line: CartLine): { item: MenuItem | undefined; modPrice: number; lineTotal: number } {
  const item = findItem(line.itemId);
  if (!item) return { item: undefined, modPrice: 0, lineTotal: 0 };
  const modPrice = (item.modifiers ?? [])
    .filter((m) => line.modifierIds.includes(m.id))
    .reduce((s, m) => s + (m.price ?? 0), 0);
  return { item, modPrice, lineTotal: (item.price + modPrice) * line.qty };
}

export function modifierLabels(line: CartLine): string[] {
  const item = findItem(line.itemId);
  if (!item) return [];
  return (item.modifiers ?? [])
    .filter((m) => line.modifierIds.includes(m.id))
    .map((m) => m.name);
}

export { MENU };
