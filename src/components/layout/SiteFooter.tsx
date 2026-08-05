import Link from "next/link";
import { SETTINGS } from "@/content/settings";
import { OrderLink } from "@/components/OrderLink";

export function SiteFooter() {
  return (
    <footer className="pt-20" style={{ background: "rgba(5,7,6,0.65)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl font-medium text-(--text)">
            Iron Oaks
          </div>
          <p className="mt-3 text-(--text-soft) text-sm max-w-sm leading-relaxed">
            {SETTINGS.brand.positioning}
          </p>
          <p className="mt-6 text-(--text-muted) text-xs uppercase tracking-wider">
            Austin, Texas · Daily · 10–4
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-(--amber) mb-3">
            Visit
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/menu" className="text-(--text-soft) hover:text-(--text)">Menu</Link></li>
            <li><Link href="/order" className="text-(--text-soft) hover:text-(--text)">How to order</Link></li>
            <li>
              <OrderLink className="text-(--amber) hover:text-(--text)">
                Order on Heartland ↗
              </OrderLink>
            </li>
            <li><Link href="/calendar" className="text-(--text-soft) hover:text-(--text)">Calendar</Link></li>
            <li><Link href="/catering" className="text-(--text-soft) hover:text-(--text)">Catering</Link></li>
            <li><Link href="/community" className="text-(--text-soft) hover:text-(--text)">Community</Link></li>
            <li><Link href="/about" className="text-(--text-soft) hover:text-(--text)">About</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-(--amber) mb-3">
            Reach us
          </div>
          <ul className="space-y-2 text-sm">
            <li className="text-(--text-soft)">{SETTINGS.contact.phone}</li>
            <li className="text-(--text-soft)">{SETTINGS.contact.instagram}</li>
            <li>
              <Link
                href="/catering"
                className="text-(--text-soft) hover:text-(--text)"
              >
                Catering inquiries
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-(--text-muted)">
          <div>© {new Date().getFullYear()} Iron Oaks</div>
          <div>
            Designed and built by{" "}
            <a
              href={SETTINGS.credits.builderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--amber) hover:text-(--text) underline-offset-4 hover:underline"
            >
              {SETTINGS.credits.builder}
              <svg width="13" height="13" viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true" className="ml-1.5 inline-block align-[-2px]"><polygon points="50,22 78,50 50,78 22,50" strokeWidth="7" strokeLinejoin="round" /><circle cx="50" cy="50" r="8" strokeWidth="7" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile-only spacer: reserves room for the fixed bottom nav so the
          footer's veil extends behind it — no bright background strip below. */}
      <div
        aria-hidden="true"
        className="md:hidden"
        style={{ height: "calc(64px + env(safe-area-inset-bottom))" }}
      />
    </footer>
  );
}
