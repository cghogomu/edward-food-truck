import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: when Edward's orders Gmail is set up, send the notification here.
    // For now we log so the wiring is visible in `next dev` output.
    console.log("[stripe] order paid:", {
      orderNumber: session.metadata?.orderNumber,
      mode: session.metadata?.mode,
      name: session.metadata?.name,
      phone: session.metadata?.phone,
      total: (session.amount_total ?? 0) / 100,
      items: session.metadata?.items,
    });
  }

  return NextResponse.json({ received: true });
}
