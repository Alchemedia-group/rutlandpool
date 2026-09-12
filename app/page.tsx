import Link from "next/link";
import {
  getCurrentSeason,
  getFixtures,
  getPublishedNews,
  getRawFixtures,
  getTeams,
} from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { WeekResultsList } from "@/components/WeekResultsList";

function formatWeekDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const season = await getCurrentSeason();
  const fixtures = season ? await getFixtures(season.id) : [];
  const news = await getPublishedNews();
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

  const weekChips = dateKeys.slice(Math.max(0, weekIndex), Math.max(0, weekIndex) + 6);

  const thisWeekFixtures = fixtures.filter(
    (f) => new Date(f.scheduled_at).toISOString().slice(0, 10) === selectedDateKey
  );

  const nextUp = fixtures
    .filter((f) => f.status === "scheduled" && new Date(f.scheduled_at).getTime() >= now)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

  const teamsById = new Map(teams.map((t) => [t.id, t]));
  const standings = computeStandings(teams.map((t) => t.id), rawFixtures).slice(0, 6);
  const latestNews = news[0];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">
          Week {weekIndex + 1} — {selectedDateKey ? formatWeekDate(selectedDateKey) : "TBC"}
        </h1>
        <span className="text-sm text-ink/50">All matches 8:00pm</span>
      </div>

      {weekChips.length > 0 && (
        <div className="-mt-6 flex flex-wrap gap-2">
          {weekChips.map((d) => (
            <Link
              key={d}
              href={`/?week=${d}`}
              className={`rounded border px-3 py-1 text-sm transition ${
                d === selectedDateKey
                  ? "border-felt-dark bg-felt-dark text-white"
                  : "border-ink/15 text-ink/60 hover:border-felt-dark hover:text-felt-dark"
              }`}
            >
              {formatWeekDate(d)}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <WeekResultsList fixtures={thisWeekFixtures} />

          {latestNews && (
            <div className="rounded-lg border-l-4 border-gold bg-cream-card px-5 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">
                League news
              </p>
              <Link href={`/news/${latestNews.slug}`} className="font-display text-lg font-bold hover:underline">
                {latestNews.title}
              </Link>
              <p className="mt-1 text-sm text-ink/70">{latestNews.body}</p>
            </div>
          )}
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
