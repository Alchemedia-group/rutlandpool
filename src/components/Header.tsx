import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/teams", label: "Teams" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/results", label: "Results" },
  { href: "/table", label: "League Table" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="bg-felt-dark text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Rutland County Pool League
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-200 transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
