import Link from "next/link";
import { getCurrentSeason, getRawFixtures, getTeams } from "@/lib/data";

export default async function AdminDashboard() {
  const season = await getCurrentSeason();
  const teams = await getTeams();
  const fixtures = season ? await getRawFixtures(season.id) : [];
  const played = fixtures.filter((f) => f.status === "played").length;
  const upcoming = fixtures.filter((f) => f.status === "scheduled").length;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Dashboard</h1>
      {!season && (
        <p className="mb-6 rounded bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          No current season is set.{" "}
          <Link href="/admin/seasons" className="underline">
            Create one
          </Link>{" "}
          before adding teams or fixtures.
        </p>
      )}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Teams" value={teams.length} />
        <Stat label="Fixtures played" value={played} />
        <Stat label="Fixtures upcoming" value={upcoming} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-ink/10 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-ink/50">{label}</p>
    </div>
  );
}
