import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return NextResponse.json({
    configured: true,
    paid: session.payment_status === "paid",
    orderNumber: session.metadata?.orderNumber ?? null,
    mode: session.metadata?.mode ?? null,
    name: session.metadata?.name ?? null,
    pickupTime: session.metadata?.pickupTime ?? null,
    total: (session.amount_total ?? 0) / 100,
    customerEmail: session.customer_details?.email ?? null,
  });
}
