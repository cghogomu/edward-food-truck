"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrderLink } from "@/components/OrderLink";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "How to order" },
  { href: "/calendar", label: "Calendar" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
] as const;

export function MobileMenuTrigger() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC to close + lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const panel = open ? (
    <div
      id="mobile-menu-panel"
      className="md:hidden flex flex-col"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: 50,
        backgroundColor: "#13110F",
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Top bar inside panel — mirrors header height so the close button sits in the same spot */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-(--color-line)">
        <span className="font-serif text-xl font-medium tracking-tight text-(--text)">
          Iron Oaks
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="w-10 h-10 -mr-1 flex items-center justify-center rounded-md text-(--text) hover:text-(--amber) transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 py-6">
        <ul className="space-y-0">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-4 px-2 border-b border-(--color-line) text-2xl font-serif transition-colors ${
                    active
                      ? "text-(--amber)"
                      : "text-(--text) hover:text-(--amber)"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-(--amber)"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 px-2">
          <OrderLink className="block w-full text-center bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-5 py-4 rounded-lg text-sm font-semibold uppercase tracking-wide">
            Order now
          </OrderLink>
          <p className="mt-2.5 text-center text-[11px] text-(--text-muted)">
            Opens Heartland in a new tab
          </p>
        </div>
      </nav>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        className="md:hidden relative w-10 h-10 -mr-1 flex items-center justify-center rounded-md text-(--text) hover:text-(--amber) transition-colors"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {mounted && panel ? createPortal(panel, document.body) : null}
    </>
  );
}
