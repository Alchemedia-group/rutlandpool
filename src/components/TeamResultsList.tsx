import Link from "next/link";
import type { FixtureWithTeams } from "@/lib/types";

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function TeamResultsList({
  fixtures,
  teamId,
}: {
  fixtures: FixtureWithTeams[];
  teamId: string;
}) {
  if (fixtures.length === 0) {
    return <p className="text-ink/50">No fixtures to show yet.</p>;
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-lg border border-ink/10">
      {fixtures.map((fixture) => {
        const isHome = fixture.home_team_id === teamId;
        const opponent = isHome ? fixture.away_team : fixture.home_team;
        const ownFrames = isHome ? fixture.home_frames : fixture.away_frames;
        const oppFrames = isHome ? fixture.away_frames : fixture.home_frames;
        const played = fixture.status === "played" && ownFrames !== null && oppFrames !== null;
        const won = played ? ownFrames! > oppFrames! : null;

        return (
          <li key={fixture.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span className="w-14 shrink-0 text-ink/40">{formatShortDate(fixture.scheduled_at)}</span>
            <Link href={`/teams/${opponent.slug}`} className="flex-1 truncate hover:underline">
              {isHome ? opponent.name : `at ${opponent.name}`}
            </Link>
            {played ? (
              <span
                className={`rounded px-2 py-0.5 font-display text-xs font-bold ${
                  won ? "bg-win/10 text-win" : "bg-loss/10 text-loss"
                }`}
              >
                {won ? "W" : "L"} {ownFrames}–{oppFrames}
              </span>
            ) : (
              <span className="rounded border border-ink/15 px-2 py-0.5 font-display text-xs font-bold text-ink/30">
                N/A – N/A
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
