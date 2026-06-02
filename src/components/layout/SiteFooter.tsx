import Link from "next/link";
import { SETTINGS } from "@/content/settings";

export function SiteFooter() {
  return (
    <footer className="bg-(--bg-raised) border-t border-(--color-line) mt-20">
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
            <li><Link href="/order" className="text-(--text-soft) hover:text-(--text)">Order</Link></li>
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

      <div className="border-t border-(--color-line)">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-(--text-muted)">
          <div>© {new Date().getFullYear()} Iron Oaks</div>
          <div>
            Built by{" "}
            <a
              href={SETTINGS.credits.builderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--amber) hover:text-(--text) underline-offset-4 hover:underline"
            >
              {SETTINGS.credits.builder}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
