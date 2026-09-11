import Link from "next/link";
import {
  getCurrentSeason,
  getFixtures,
  getPublishedNews,
  getRawFixtures,
  getTeams,
} from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { FixtureList } from "@/components/FixtureList";

function formatWeekDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function HomePage() {
  const season = await getCurrentSeason();
  const fixtures = season ? await getFixtures(season.id) : [];
  const news = await getPublishedNews();
  const teams = await getTeams();
  const rawFixtures = season ? await getRawFixtures(season.id) : [];

  const now = Date.now();

  // Group fixtures by match date to find "this week" and a run of upcoming weeks.
  const dateKeys = Array.from(
    new Set(fixtures.map((f) => new Date(f.scheduled_at).toDateString()))
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const nextDateKey =
    dateKeys.find((d) => new Date(d).getTime() >= now - 1000 * 60 * 60 * 24) ??
    dateKeys[dateKeys.length - 1];

  const weekChips = dateKeys.slice(
    Math.max(0, dateKeys.indexOf(nextDateKey)),
    Math.max(0, dateKeys.indexOf(nextDateKey)) + 6
  );

  const thisWeekFixtures = fixtures.filter(
    (f) => new Date(f.scheduled_at).toDateString() === nextDateKey
  );

  const nextUp = fixtures
    .filter((f) => f.status === "scheduled" && new Date(f.scheduled_at).getTime() >= now)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

  const recentResults = fixtures
    .filter((f) => f.status === "played")
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 5);

  const teamsById = new Map(teams.map((t) => [t.id, t]));
  const standings = computeStandings(teams.map((t) => t.id), rawFixtures).slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="rounded-lg bg-felt px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">Rutland County Pool League</h1>
        <p className="mt-2 max-w-2xl text-gray-100">
          Fixtures, results, standings and stats for teams across Rutland
          {season ? ` — ${season.name}` : ""}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/standings" className="rounded bg-gold px-4 py-2 font-semibold text-felt-dark">
            Standings
          </Link>
          <Link href="/fixtures" className="rounded border border-white px-4 py-2">
            Fixtures
          </Link>
        </div>
      </section>

      {weekChips.length > 0 && (
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">
              Week {dateKeys.indexOf(nextDateKey) + 1} — {formatWeekDate(nextDateKey)}
            </h2>
            <span className="text-sm text-gray-500">All matches 8:00pm</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {weekChips.map((d) => (
              <span
                key={d}
                className={`rounded border px-3 py-1 text-sm ${
                  d === nextDateKey
                    ? "border-felt bg-felt text-white"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {formatWeekDate(d)}
              </span>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-[1fr_320px]">
            <FixtureList fixtures={thisWeekFixtures} />
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
                <p className="mt-2 text-lg font-semibold">
                  {nextUp.home_team.name}
                  <span className="mx-2 text-gray-400">v</span>
                  {nextUp.away_team.name}
                </p>
                {nextUp.venue && <p className="mt-1 text-sm text-gray-300">{nextUp.venue}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xl font-semibold">Recent results</h2>
          <FixtureList fixtures={recentResults} />
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Table</h2>
            <Link href="/standings" className="text-sm text-felt hover:underline">
              Full standings
            </Link>
          </div>
          {standings.length === 0 ? (
            <p className="text-gray-500">No standings yet.</p>
          ) : (
            <ol className="divide-y divide-gray-200">
              {standings.map((row, i) => {
                const team = teamsById.get(row.team_id);
                return (
                  <li key={row.team_id} className="flex items-center justify-between py-2 text-sm">
                    <span>
                      <span className="mr-2 text-gray-400">{i + 1}</span>
                      {team?.name ?? "Unknown"}
                    </span>
                    <span className="font-semibold">{row.points}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest news</h2>
          <Link href="/news" className="text-sm text-felt hover:underline">
            View all
          </Link>
        </div>
        {news.length === 0 ? (
          <p className="text-gray-500">No news posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {news.slice(0, 3).map((post) => (
              <li key={post.id}>
                <Link href={`/news/${post.slug}`} className="font-medium hover:underline">
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(post.published_at).toLocaleDateString("en-GB")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
