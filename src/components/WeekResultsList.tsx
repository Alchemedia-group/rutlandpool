import Link from "next/link";
import { fixtureVenue } from "@/lib/format";
import type { FixtureWithTeams } from "@/lib/types";

/**
 * The Match Hub's "this week" list: home team (bold, left) — score (centre)
 * — away team (right), no repeated date since the week heading above
 * already covers it. Distinct from FixtureList, which is used everywhere a
 * fixture's own date/venue still needs to appear per row.
 */
export function WeekResultsList({ fixtures }: { fixtures: FixtureWithTeams[] }) {
  if (fixtures.length === 0) {
    return <p className="text-ink/50">No fixtures this week.</p>;
  }

  return (
    <ul className="divide-y divide-ink/10">
      {fixtures.map((fixture) => {
        const venue = fixtureVenue(fixture);
        return (
          <li key={fixture.id} className="py-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="flex items-center gap-1">
                <Link href={`/teams/${fixture.home_team.slug}`} className="font-semibold hover:underline">
                  {fixture.home_team.name}
                </Link>
                <span className="text-xs font-normal text-ink/40">(H)</span>
              </div>
              {fixture.status === "played" ? (
                <div className="rounded bg-felt-dark px-3 py-1 font-display text-sm font-bold text-cream">
                  {fixture.home_frames} – {fixture.away_frames}
                </div>
              ) : (
                <div className="rounded border border-ink/15 px-3 py-1 font-display text-sm font-bold text-ink/30">
                  N/A – N/A
                </div>
              )}
              <div className="flex items-center justify-end gap-1">
                <span className="text-xs font-normal text-ink/40">(A)</span>
                <Link
                  href={`/teams/${fixture.away_team.slug}`}
                  className="text-right text-ink/80 hover:underline"
                >
                  {fixture.away_team.name}
                </Link>
              </div>
            </div>
            {venue && <p className="mt-1 text-center text-xs text-ink/40">{venue}</p>}
          </li>
        );
      })}
    </ul>
  );
}
