import Link from "next/link";
import type { FixtureWithTeams } from "@/lib/types";

/**
 * The Match Hub's "this week" list: home team (bold, left) — score (centre)
 * — away team (right), no repeated date/venue since the week heading above
 * already covers it. Distinct from FixtureList, which is used everywhere a
 * fixture's own date/venue still needs to appear per row.
 */
export function WeekResultsList({ fixtures }: { fixtures: FixtureWithTeams[] }) {
  if (fixtures.length === 0) {
    return <p className="text-ink/50">No fixtures this week.</p>;
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-lg border border-ink/10 bg-cream-card">
      {fixtures.map((fixture) => (
        <li key={fixture.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4">
          <Link href={`/teams/${fixture.home_team.slug}`} className="font-semibold hover:underline">
            {fixture.home_team.name}
          </Link>
          {fixture.status === "played" ? (
            <div className="rounded bg-felt-dark px-3 py-1 font-display text-sm font-bold text-cream">
              {fixture.home_frames} – {fixture.away_frames}
            </div>
          ) : (
            <div className="rounded border border-ink/15 px-3 py-1 font-display text-sm font-bold text-ink/30">
              N/A – N/A
            </div>
          )}
          <Link
            href={`/teams/${fixture.away_team.slug}`}
            className="text-right text-ink/80 hover:underline"
          >
            {fixture.away_team.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
