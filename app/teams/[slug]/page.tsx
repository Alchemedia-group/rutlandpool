import { notFound } from "next/navigation";
import {
  getCurrentSeason,
  getFixturesForTeam,
  getFramesForSeason,
  getPlayersForTeam,
  getRawFixtures,
  getTeamBySlug,
  getTeams,
} from "@/lib/data";
import { computeCombinedPlayerRecords } from "@/lib/playerStats";
import { computeStandings } from "@/lib/standings";
import { ordinalPosition, shortName, teamBadgeCode } from "@/lib/format";
import { TeamResultsList } from "@/components/TeamResultsList";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const fixtures = await getFixturesForTeam(team.id);
  const players = await getPlayersForTeam(team.id);
  const season = await getCurrentSeason();
  const frames = season ? await getFramesForSeason(season.id) : [];
  const records = new Map(computeCombinedPlayerRecords(frames).map((r) => [r.player_id, r]));

  const teams = await getTeams();
  const rawFixtures = season ? await getRawFixtures(season.id) : [];
  const standings = computeStandings(
    teams.map((t) => t.id),
    rawFixtures
  );
  const position = standings.findIndex((r) => r.team_id === team.id);
  const row = position >= 0 ? standings[position] : null;

  const captain = players.find((p) => p.is_captain);

  const played = fixtures.filter((f) => f.status === "played");
  const upcoming = fixtures.filter((f) => f.status !== "played");

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-felt-dark px-6 py-5 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-felt font-display text-lg font-bold ring-2 ring-cream/30">
            {teamBadgeCode(team.name)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{team.name}</h1>
            <p className="text-sm text-gray-300">
              {[team.venue, captain ? `Captain: ${shortName(captain.name)}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
        {row && (
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="font-display text-xl font-bold">{ordinalPosition(position + 1)}</p>
              <p className="text-xs uppercase tracking-wide text-gray-300">Position</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold">
                {row.won}-{row.drawn}-{row.lost}
              </p>
              <p className="text-xs uppercase tracking-wide text-gray-300">W-D-L</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-gold">{row.points}</p>
              <p className="text-xs uppercase tracking-wide text-gray-300">Points</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-semibold">Squad</h2>
          {players.length === 0 ? (
            <p className="text-ink/50">No players added yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-ink/10">
              <table className="w-full min-w-[380px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ink/15 bg-cream-card text-left text-ink/50">
                    <th className="py-2 pr-4">Player</th>
                    <th className="px-2 py-2 text-center">P</th>
                    <th className="px-2 py-2 text-center">W</th>
                    <th className="py-2 pl-2 text-right">Win%</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => {
                    const record = records.get(player.id);
                    return (
                      <tr key={player.id} className="border-b border-ink/5">
                        <td className="py-2 pr-4 font-medium">
                          {player.name}
                          {player.is_captain && (
                            <span className="ml-1 text-xs text-ink/40">(c)</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">{record?.played ?? 0}</td>
                        <td className="px-2 py-2 text-center">{record?.won ?? 0}</td>
                        <td className="py-2 pl-2 text-right">
                          {record ? record.winPct.toFixed(1) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold">Results</h2>
          <TeamResultsList fixtures={played} teamId={team.id} />

          {upcoming.length > 0 && (
            <details className="mt-4 rounded-lg border border-ink/10">
              <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-ink/60">
                Not yet played ({upcoming.length})
              </summary>
              <div className="border-t border-ink/10">
                <TeamResultsList fixtures={upcoming} teamId={team.id} />
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
