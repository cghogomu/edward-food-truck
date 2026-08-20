import Link from "next/link";
import { deriveOpenStatus, orderNote } from "@/lib/state";
import type { SiteState } from "@/types";
import { OpenStatusPill } from "@/components/OpenStatusPill";
import { MobileMenuTrigger } from "@/components/layout/MobileMenuTrigger";
import { HeaderOrderButton } from "@/components/HeaderOrderButton";

export function SiteHeader({ state }: { state: SiteState }) {
  const status = deriveOpenStatus(state);
  return (
    <header className="sticky top-0 z-40 bg-(--bg)/85 backdrop-blur-md border-b border-(--color-line)">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-xl font-medium tracking-tight text-gold-chrome transition-[filter] hover:brightness-110"
        >
          Iron Oaks
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link href="/menu" className="text-(--text-soft) hover:text-(--text) transition-colors">Menu</Link>
          <Link href="/calendar" className="text-(--text-soft) hover:text-(--text) transition-colors">Calendar</Link>
          <Link href="/catering" className="text-(--text-soft) hover:text-(--text) transition-colors">Catering</Link>
          <Link href="/about" className="text-(--text-soft) hover:text-(--text) transition-colors">About</Link>
          <Link href="/community" className="text-(--text-soft) hover:text-(--text) transition-colors">Community</Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex">
            <OpenStatusPill status={status} compact />
          </span>
          <HeaderOrderButton />
          <MobileMenuTrigger note={orderNote(status)} />
        </div>
      </div>
    </header>
  );
}
