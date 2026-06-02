import type { CartLine } from "@/types";
import { findItem } from "@/content/menu";
import { isDeliverable } from "@/content/zips";
import { SETTINGS } from "@/content/settings";

export type CheckoutMode = "pickup" | "delivery";

export type CheckoutPayload = {
  lines: CartLine[];
  mode: CheckoutMode;
  name: string;
  phone: string;
  email?: string;
  pickupTime?: string;
  address?: string;
  zip?: string;
  notes?: string;
};

export type PricedLine = {
  itemId: string;
  itemName: string;
  unitAmount: number; // cents
  quantity: number;
  modifierLabels: string[];
  note?: string;
};

export type PricedOrder = {
  lines: PricedLine[];
  subtotal: number; // cents
  tax: number;
  deliveryFee: number;
  processingFee: number;
  total: number;
  summary: string; // short human-readable line summary for receipts / notifications
};

const toCents = (n: number) => Math.round(n * 100);

export function priceOrder(payload: CheckoutPayload): PricedOrder {
  const pricedLines: PricedLine[] = [];
  let subtotalCents = 0;

  for (const line of payload.lines) {
    const item = findItem(line.itemId);
    if (!item || item.comingSoon) continue;
    if (line.qty <= 0) continue;

    const mods = (item.modifiers ?? []).filter((m) => line.modifierIds.includes(m.id));
    const modPriceCents = mods.reduce((s, m) => s + toCents(m.price ?? 0), 0);
    const unitAmount = toCents(item.price) + modPriceCents;
    subtotalCents += unitAmount * line.qty;

    pricedLines.push({
      itemId: item.id,
      itemName: item.name,
      unitAmount,
      quantity: line.qty,
      modifierLabels: mods.map((m) => m.name),
      note: line.note,
    });
  }

  const taxCents = Math.round(subtotalCents * SETTINGS.ordering.salesTaxRate);
  const deliveryCents =
    payload.mode === "delivery" && !SETTINGS.ordering.deliveryFeePromoActive
      ? toCents(SETTINGS.ordering.deliveryFee)
      : 0;
  const processingCents = pricedLines.length > 0 ? toCents(SETTINGS.ordering.stripeFeePassThrough) : 0;
  const totalCents = subtotalCents + taxCents + deliveryCents + processingCents;

  const summary = pricedLines
    .map((l) => `${l.quantity}× ${l.itemName}`)
    .join(", ")
    .slice(0, 480);

  return {
    lines: pricedLines,
    subtotal: subtotalCents,
    tax: taxCents,
    deliveryFee: deliveryCents,
    processingFee: processingCents,
    total: totalCents,
    summary,
  };
}

export function validateCheckout(payload: CheckoutPayload, priced: PricedOrder): string | null {
  if (priced.lines.length === 0) return "Cart is empty.";
  if (!payload.name?.trim()) return "Name is required.";
  if (!payload.phone?.trim()) return "Phone is required.";
  if (payload.mode === "delivery") {
    if (!payload.address?.trim()) return "Delivery address is required.";
    const zip = (payload.zip ?? "").trim();
    if (zip.length !== 5) return "ZIP must be 5 digits.";
    if (!isDeliverable(zip)) return "That ZIP is outside the delivery zone.";
  }
  return null;
}

export function makeOrderNumber(): string {
  return `IO-${Date.now().toString().slice(-6)}`;
}
