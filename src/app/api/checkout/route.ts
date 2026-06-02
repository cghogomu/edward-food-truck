import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  priceOrder,
  validateCheckout,
  makeOrderNumber,
  type CheckoutPayload,
} from "@/lib/order";
import { SETTINGS } from "@/content/settings";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutPayload;
  const priced = priceOrder(payload);

  const validationError = validateCheckout(payload, priced);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Stripe not wired up yet — the order page falls back to its demo flow.
  if (!isStripeConfigured()) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const stripe = getStripe();
  const orderNumber = makeOrderNumber();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";

  type CheckoutCreateParams = NonNullable<
    Parameters<Stripe["checkout"]["sessions"]["create"]>[0]
  >;
  type LineItem = NonNullable<CheckoutCreateParams["line_items"]>[number];

  const lineItems: LineItem[] =
    priced.lines.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: "usd",
        unit_amount: l.unitAmount,
        product_data: {
          name: l.itemName,
          description:
            [l.modifierLabels.join(", "), l.note ? `Note: ${l.note}` : ""]
              .filter(Boolean)
              .join(" · ") || undefined,
        },
      },
    }));

  if (priced.tax > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: priced.tax,
        product_data: { name: `Sales tax (${(SETTINGS.ordering.salesTaxRate * 100).toFixed(2)}%)` },
      },
    });
  }

  if (priced.deliveryFee > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: priced.deliveryFee,
        product_data: { name: "Delivery" },
      },
    });
  }

  if (priced.processingFee > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: priced.processingFee,
        product_data: { name: "Online processing fee" },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    customer_email: payload.email || undefined,
    phone_number_collection: { enabled: !payload.phone },
    success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/order`,
    metadata: {
      orderNumber,
      mode: payload.mode,
      name: payload.name,
      phone: payload.phone,
      pickupTime: payload.pickupTime ?? "",
      address: payload.address ?? "",
      zip: payload.zip ?? "",
      notes: payload.notes ?? "",
      items: priced.summary,
    },
    payment_intent_data: {
      description: `Iron Oaks · ${orderNumber} · ${payload.mode}`,
      metadata: { orderNumber, mode: payload.mode },
    },
  });

  return NextResponse.json({
    configured: true,
    url: session.url,
    sessionId: session.id,
    orderNumber,
  });
}
