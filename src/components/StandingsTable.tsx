import Link from "next/link";
import type { TeamRow } from "@/lib/standings";
import type { Team } from "@/lib/types";

export function StandingsTable({
  rows,
  teamsById,
}: {
  rows: TeamRow[];
  teamsById: Map<string, Team>;
}) {
  if (rows.length === 0) {
    return <p className="text-ink/50">No teams in the current season yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink/10 bg-cream-card">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink/15 bg-cream text-left text-ink/50">
            <th className="py-2 pl-4 pr-4">#</th>
            <th className="py-2 pr-4 font-display uppercase tracking-wide">Team</th>
            <th className="px-2 py-2 text-center">P</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="px-2 py-2 text-center">D</th>
            <th className="px-2 py-2 text-center">L</th>
            <th className="px-2 py-2 text-center">F</th>
            <th className="px-2 py-2 text-center">A</th>
            <th className="px-2 py-2 text-center">+/-</th>
            <th className="py-2 pl-2 pr-4 text-center font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const team = teamsById.get(row.team_id);
            return (
              <tr key={row.team_id} className="border-b border-ink/5 last:border-0">
                <td className="py-2 pl-4 pr-4 text-ink/40">{i + 1}</td>
                <td className="py-2 pr-4 font-medium">
                  {team ? (
                    <Link href={`/teams/${team.slug}`} className="hover:underline">
                      {team.name}
                    </Link>
                  ) : (
                    "Unknown team"
                  )}
                </td>
                <td className="px-2 py-2 text-center">{row.played}</td>
                <td className="px-2 py-2 text-center">{row.won}</td>
                <td className="px-2 py-2 text-center">{row.drawn}</td>
                <td className="px-2 py-2 text-center">{row.lost}</td>
                <td className="px-2 py-2 text-center">{row.framesFor}</td>
                <td className="px-2 py-2 text-center">{row.framesAgainst}</td>
                <td className="px-2 py-2 text-center">
                  {row.framesFor - row.framesAgainst}
                </td>
                <td className="py-2 pl-2 pr-4 text-center font-display font-bold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
