import "server-only";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export function isStripeConfigured(): boolean {
  return Boolean(secretKey);
}

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local — see .env.local.example."
    );
  }
  if (!cached) {
    cached = new Stripe(secretKey, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
      appInfo: { name: "Iron Oaks (Meridian Works)" },
    });
  }
  return cached;
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
