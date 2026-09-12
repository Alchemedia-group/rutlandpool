import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/seasons", label: "Seasons" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/fixtures", label: "Fixtures & results" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The login page itself renders without this chrome/gate.
  if (!user) {
    return children;
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-xl font-bold">Not authorised</h1>
        <p className="mt-2 text-ink/70">
          {user.email} is signed in but isn&apos;t a committee admin. Ask an
          existing admin to add your user id to the <code>admins</code>{" "}
          table.
        </p>
        <form action={logout} className="mt-4">
          <button className="rounded border border-ink/15 px-4 py-2 text-sm" type="submit">
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[200px_1fr]">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded px-3 py-2 text-sm hover:bg-cream-card"
          >
            {link.label}
          </Link>
        ))}
        <form action={logout} className="pt-4">
          <button className="w-full rounded px-3 py-2 text-left text-sm text-ink/50 hover:bg-cream-card" type="submit">
            Sign out
          </button>
        </form>
      </nav>
      <div>{children}</div>
    </div>
  );
}
