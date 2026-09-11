import Link from "next/link";
import { getCurrentSeason, getFixtures, getRawFixtures, getTeams } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { StandingsTable } from "@/components/StandingsTable";

function formatWeekDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function StandingsPage() {
  const season = await getCurrentSeason();
  const teams = await getTeams();
  const rawFixtures = season ? await getRawFixtures(season.id) : [];
  const fixtures = season ? await getFixtures(season.id) : [];

  const teamIds = teams.map((t) => t.id);
  const rows = computeStandings(teamIds, rawFixtures);
  const teamsById = new Map(teams.map((t) => [t.id, t]));

  const now = Date.now();
  const nextFixture = fixtures.find(
    (f) => new Date(f.scheduled_at).getTime() >= now - 1000 * 60 * 60 * 24
  );
  const nextDateKey = nextFixture ? new Date(nextFixture.scheduled_at).toDateString() : null;
  const upcomingWeek = nextDateKey
    ? fixtures.filter((f) => new Date(f.scheduled_at).toDateString() === nextDateKey)
    : [];

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold">
          Division One
          <span className="flex items-center gap-1 text-sm font-sans font-normal text-felt">
            <span className="h-1.5 w-1.5 rounded-full bg-felt" /> Live
          </span>
        </h1>
        {season && <p className="mb-6 text-ink/50">{season.name}</p>}
        <StandingsTable rows={rows} teamsById={teamsById} />
        <p className="mt-4 text-xs text-ink/40">
          2 points per frame won, 1 per frame lost, 5 for the match. Ties broken by frame difference, then frames for.
        </p>
      </div>

      <div className="space-y-6">
        {nextDateKey && (
          <div>
            <h2 className="mb-3 text-lg font-bold">
              Fixtures — {formatWeekDate(nextDateKey)}
            </h2>
            <ul className="divide-y divide-ink/10 rounded-lg border border-ink/10">
              {upcomingWeek.map((fixture) => (
                <li key={fixture.id} className="px-4 py-3 text-sm">
                  <Link href={`/teams/${fixture.home_team.slug}`} className="hover:underline">
                    {fixture.home_team.name}
                  </Link>
                  <span className="mx-1 text-ink/40">v</span>
                  <Link href={`/teams/${fixture.away_team.slug}`} className="hover:underline">
                    {fixture.away_team.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-lg border border-dashed border-ink/15 bg-cream-card p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/50">
            Download
          </p>
          <p className="text-sm text-ink/70">
            Full 22-week fixture list as PDF or calendar subscription.
          </p>
        </div>
      </div>
    </div>
  );
}
