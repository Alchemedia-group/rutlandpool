import Link from "next/link";

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
  return (
    <header className="bg-felt-dark text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold text-xs font-bold">
            RCPL
          </span>
          <Link href="/" className="text-lg font-bold tracking-tight">
            Rutland County Pool League
          </Link>
        </div>
        {seasonName && (
          <span className="rounded bg-gold px-3 py-1 text-sm font-semibold text-felt-dark">
            {seasonName}
          </span>
        )}
      </div>
      <nav className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-2 px-4 py-3 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-200 transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
