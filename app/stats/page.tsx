import Link from "next/link";
import { getAllPlayers, getCurrentSeason, getFramesForSeason, getTeams } from "@/lib/data";
import { computeBreakWins, computePlayerRecords } from "@/lib/playerStats";

const TABS = [
  { key: "singles", label: "Singles" },
  { key: "doubles", label: "Doubles" },
  { key: "breaks", label: "Breaks" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: TabKey = TABS.some((t) => t.key === tab) ? (tab as TabKey) : "singles";

  const season = await getCurrentSeason();
  const players = await getAllPlayers();
  const teams = await getTeams();
  const frames = season ? await getFramesForSeason(season.id) : [];

  const playersById = new Map(players.map((p) => [p.id, p]));
  const teamsById = new Map(teams.map((t) => [t.id, t]));
  const teamNameFor = (playerId: string) => {
    const player = playersById.get(playerId);
    return player ? teamsById.get(player.team_id)?.name ?? "—" : "—";
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Player Stats</h1>
      {season && <p className="mb-6 text-gray-500">{season.name}</p>}

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/stats?tab=${t.key}`}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              activeTab === t.key ? "bg-felt text-white" : "border border-gray-300 text-gray-600"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {(activeTab === "singles" || activeTab === "doubles") && (
        <RecordTable
          rows={computePlayerRecords(frames, activeTab)}
          playersById={playersById}
          teamNameFor={teamNameFor}
        />
      )}

      {activeTab === "breaks" && (
        <BreaksTable rows={computeBreakWins(frames)} playersById={playersById} teamNameFor={teamNameFor} />
      )}

      <p className="mt-4 text-xs text-gray-400">
        {activeTab === "breaks"
          ? "Frames won on the break, credited to every player on the winning side."
          : "Minimum 4 frames played to qualify."}
      </p>
    </div>
  );
}

function RecordTable({
  rows,
  playersById,
  teamNameFor,
}: {
  rows: ReturnType<typeof computePlayerRecords>;
  playersById: Map<string, { name: string }>;
  teamNameFor: (playerId: string) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-gray-500">No frames recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-gray-500">
            <th className="py-2 pr-4">#</th>
            <th className="py-2 pr-4">Player</th>
            <th className="py-2 pr-4">Team</th>
            <th className="px-2 py-2 text-center">P</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="px-2 py-2 text-center">L</th>
            <th className="py-2 pl-2 text-right">Win%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.player_id} className="border-b border-gray-100">
              <td className="py-2 pr-4 text-gray-500">{i + 1}</td>
              <td className="py-2 pr-4 font-medium">
                {playersById.get(row.player_id)?.name ?? "Unknown"}
              </td>
              <td className="py-2 pr-4 text-gray-500">{teamNameFor(row.player_id)}</td>
              <td className="px-2 py-2 text-center">{row.played}</td>
              <td className="px-2 py-2 text-center">{row.won}</td>
              <td className="px-2 py-2 text-center">{row.lost}</td>
              <td className="py-2 pl-2 text-right font-semibold">{row.winPct.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BreaksTable({
  rows,
  playersById,
  teamNameFor,
}: {
  rows: ReturnType<typeof computeBreakWins>;
  playersById: Map<string, { name: string }>;
  teamNameFor: (playerId: string) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-gray-500">No break wins recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-gray-500">
            <th className="py-2 pr-4">#</th>
            <th className="py-2 pr-4">Player</th>
            <th className="py-2 pr-4">Team</th>
            <th className="py-2 pl-2 text-right">Break wins</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.player_id} className="border-b border-gray-100">
              <td className="py-2 pr-4 text-gray-500">{i + 1}</td>
              <td className="py-2 pr-4 font-medium">
                {playersById.get(row.player_id)?.name ?? "Unknown"}
              </td>
              <td className="py-2 pr-4 text-gray-500">{teamNameFor(row.player_id)}</td>
              <td className="py-2 pl-2 text-right font-semibold">{row.breakWins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
