"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Match Hub" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/standings", label: "Standings" },
  { href: "/teams", label: "Teams" },
  { href: "/stats", label: "Stats" },
  { href: "/venues", label: "Venues" },
  { href: "/rules", label: "Rules" },
  { href: "/agm-2026", label: "AGM 2026" },
];

export function Header({ seasonName }: { seasonName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever navigation actually happens (covers back/
  // forward too, not just clicking a link).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="bg-felt-dark text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Rutland County Pool League"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full"
          />
          <span className="min-w-0 truncate font-display text-lg font-bold tracking-tight">
            <span className="hidden sm:inline">Rutland County Pool League</span>
            <span className="sm:hidden">RCPL</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          {seasonName && (
            <span className="whitespace-nowrap rounded bg-gold px-3 py-1 font-display text-sm font-bold text-felt-dark">
              {seasonName}
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex items-center rounded p-1.5 text-white md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden border-t border-white/10 md:block">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-2 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display text-sm uppercase tracking-wide transition ${
                isActive(link.href) ? "font-bold text-white" : "text-gray-300 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile slide-out drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 right-0 z-50 w-64 max-w-[80vw] transform bg-felt-dark shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <span className="font-display text-sm font-bold uppercase tracking-wide text-gold">Menu</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-1 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              <line x1="6" y1="18" x2="18" y2="6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 font-display text-sm uppercase tracking-wide transition ${
                isActive(link.href) ? "bg-white/10 font-bold text-white" : "text-gray-300 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
