import Link from "next/link";
import type { FixtureWithTeams } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * `perspectiveTeamId`: when set (team pages), a played result shows a
 * W/L badge and score from that team's point of view, matching the design's
 * team results list. Without it (league-wide lists), it's a neutral score pill.
 */
export function FixtureList({
  fixtures,
  perspectiveTeamId,
}: {
  fixtures: FixtureWithTeams[];
  perspectiveTeamId?: string;
}) {
  if (fixtures.length === 0) {
    return <p className="text-ink/50">No fixtures to show yet.</p>;
  }

  return (
    <ul className="divide-y divide-ink/10 rounded-lg border border-ink/10 bg-cream-card">
      {fixtures.map((fixture) => {
        const isHome = fixture.home_team_id === perspectiveTeamId;
        const ownFrames = isHome ? fixture.home_frames : fixture.away_frames;
        const oppFrames = isHome ? fixture.away_frames : fixture.home_frames;
        const won = perspectiveTeamId && ownFrames !== null && oppFrames !== null
          ? ownFrames > oppFrames
          : null;

        return (
          <li key={fixture.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-4">
            <div>
              <p className="font-medium">
                <Link href={`/teams/${fixture.home_team.slug}`} className="hover:underline">
                  {fixture.home_team.name}
                </Link>
                {" v "}
                <Link href={`/teams/${fixture.away_team.slug}`} className="hover:underline">
                  {fixture.away_team.name}
                </Link>
              </p>
              <p className="text-sm text-ink/50">
                {formatDate(fixture.scheduled_at)}
                {fixture.venue ? ` · ${fixture.venue}` : ""}
                {fixture.status !== "scheduled" && fixture.status !== "played"
                  ? ` · ${fixture.status}`
                  : ""}
              </p>
            </div>
            {fixture.status === "played" && (
              perspectiveTeamId ? (
                <div className={`font-display text-sm font-bold ${won ? "text-win" : "text-loss"}`}>
                  {won ? "W" : "L"} {ownFrames}–{oppFrames}
                </div>
              ) : (
                <div className="rounded bg-felt-dark px-3 py-1 font-display text-sm font-bold text-cream">
                  {fixture.home_frames} – {fixture.away_frames}
                </div>
              )
            )}
          </li>
        );
      })}
    </ul>
  );
}
