"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Match Hub" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/standings", label: "Standings" },
  { href: "/teams", label: "Teams" },
  { href: "/stats", label: "Stats" },
  { href: "/venues", label: "Venues" },
  { href: "/news", label: "News" },
];

export function Header({ seasonName }: { seasonName?: string }) {
  const pathname = usePathname();

  return (
    <header className="bg-felt-dark text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold font-display text-xs font-bold text-gold">
            RCPL
          </span>
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            Rutland County Pool League
          </Link>
        </div>
        {seasonName && (
          <span className="rounded bg-gold px-3 py-1 font-display text-sm font-bold text-felt-dark">
            {seasonName}
          </span>
        )}
      </div>
      <nav className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-2 px-4 py-3">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-sm uppercase tracking-wide transition ${
                  active ? "font-bold text-white" : "text-gray-300 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
