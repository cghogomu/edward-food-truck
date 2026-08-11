import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { getSiteState, deriveOpenStatus, isOrderable } from "@/lib/state";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iron Oaks — Loaded Potatoes · Austin",
  description:
    "Upscale quality, for blue collar pockets. Loaded potatoes made one at a time in Austin, Texas.",
};

// Site state (open status, inventory, banner, calendar) is edited live from
// the dashboard, so every page must render at request time rather than being
// frozen into the static build. This cascades to all nested routes.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const state = await getSiteState();
  // One source of truth for whether any "Order" CTA is live, so the header,
  // footer and mobile nav can never disagree with the status badge.
  const status = deriveOpenStatus(state);
  const orderable = isOrderable(status);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader state={state} />
        <main className="flex-1">{children}</main>
        <SiteFooter orderable={orderable} />
        <MobileBottomNav orderable={orderable} reason={status.detail} />
      </body>
    </html>
  );
}
