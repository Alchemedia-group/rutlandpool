import {
  getCurrentSeason,
  getFixtures,
  getRawFixtures,
  getTeams,
} from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { formatWeekDate } from "@/lib/format";
import { WeekChips } from "@/components/WeekChips";
import { WeekResultsList } from "@/components/WeekResultsList";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const season = await getCurrentSeason();
  const fixtures = season ? await getFixtures(season.id) : [];
  const teams = await getTeams();
  const rawFixtures = season ? await getRawFixtures(season.id) : [];

  const now = Date.now();

  // Plain YYYY-MM-DD (UTC) so it doubles as a stable, linkable ?week= value.
  const dateKeys = Array.from(
    new Set(fixtures.map((f) => new Date(f.scheduled_at).toISOString().slice(0, 10)))
  ).sort();

  const upcomingDateKey =
    dateKeys.find((d) => new Date(d).getTime() >= now - 1000 * 60 * 60 * 24) ??
    dateKeys[dateKeys.length - 1];
  const selectedDateKey = week && dateKeys.includes(week) ? week : upcomingDateKey;
  const weekIndex = dateKeys.indexOf(selectedDateKey);

  const thisWeekFixtures = fixtures.filter(
    (f) => new Date(f.scheduled_at).toISOString().slice(0, 10) === selectedDateKey
  );

  const nextUp = fixtures
    .filter((f) => f.status === "scheduled" && new Date(f.scheduled_at).getTime() >= now)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

  const teamsById = new Map(teams.map((t) => [t.id, t]));
  const standings = computeStandings(teams.map((t) => t.id), rawFixtures).slice(0, 6);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">
          Week {weekIndex + 1} — {selectedDateKey ? formatWeekDate(selectedDateKey) : "TBC"}
        </h1>
        <span className="text-sm text-ink/50">All matches 8:00pm</span>
      </div>

      {dateKeys.length > 0 && <WeekChips dateKeys={dateKeys} selectedDateKey={selectedDateKey} />}

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <WeekResultsList fixtures={thisWeekFixtures} />
        </div>

        <div className="space-y-8">
          {nextUp && (
            <div className="rounded-lg bg-felt-dark p-5 text-white">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
                Next up
              </p>
              <p className="text-sm text-gray-300">
                {new Date(nextUp.scheduled_at).toLocaleString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-2 font-display text-lg font-bold">
                {nextUp.home_team.name}
                <span className="mx-2 text-ink/40">v</span>
                {nextUp.away_team.name}
              </p>
              {nextUp.venue && <p className="mt-1 text-sm text-gray-300">{nextUp.venue}</p>}
            </div>
          )}

          <div>
            <h2 className="mb-3 text-lg font-bold">Table</h2>
            {standings.length === 0 ? (
              <p className="text-ink/50">No standings yet.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-ink/10">
                <div className="flex items-center justify-between bg-cream-card px-4 py-2 text-xs uppercase tracking-wide text-ink/50">
                  <span className="flex gap-3">
                    <span className="w-4 text-right">#</span>
                    <span>Team</span>
                  </span>
                  <span className="flex gap-4">
                    <span>P</span>
                    <span>Pts</span>
                  </span>
                </div>
                <ol className="divide-y divide-ink/5">
                  {standings.map((row, i) => {
                    const team = teamsById.get(row.team_id);
                    return (
                      <li key={row.team_id} className="flex items-center justify-between px-4 py-2 text-sm">
                        <span className="flex gap-3">
                          <span className="w-4 text-right text-ink/40">{i + 1}</span>
                          {team?.name ?? "Unknown"}
                        </span>
                        <span className="flex gap-4">
                          <span className="text-ink/60">{row.played}</span>
                          <span className="font-display font-bold">{row.points}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
            <p className="mt-2 text-xs text-ink/40">Updated live as captains submit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
