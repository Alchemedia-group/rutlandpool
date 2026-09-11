import { notFound } from "next/navigation";
import {
  getCurrentSeason,
  getFixturesForTeam,
  getFramesForSeason,
  getPlayersForTeam,
  getTeamBySlug,
} from "@/lib/data";
import { computeCombinedPlayerRecords } from "@/lib/playerStats";
import { FixtureList } from "@/components/FixtureList";

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

  return (
    <div>
      <h1 className="text-2xl font-bold">{team.name}</h1>
      {team.venue && <p className="mt-1 text-gray-500">Home venue: {team.venue}</p>}

      <h2 className="mb-3 mt-8 text-xl font-semibold">Squad</h2>
      {players.length === 0 ? (
        <p className="text-gray-500">No players added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-gray-500">
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
                  <tr key={player.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">
                      {player.name}
                      {player.is_captain && (
                        <span className="ml-1 text-xs text-gray-400">(c)</span>
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

      <h2 className="mb-3 mt-8 text-xl font-semibold">Fixtures &amp; results</h2>
      <FixtureList fixtures={fixtures} />
    </div>
  );
}
