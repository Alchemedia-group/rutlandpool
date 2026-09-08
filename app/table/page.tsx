import { getCurrentSeason, getRawFixtures, getTeams } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { StandingsTable } from "@/components/StandingsTable";

export default async function TablePage() {
  const season = await getCurrentSeason();
  const teams = await getTeams();
  const fixtures = season ? await getRawFixtures(season.id) : [];

  const teamIds = teams.map((t) => t.id);
  const rows = computeStandings(teamIds, fixtures);
  const teamsById = new Map(teams.map((t) => [t.id, t]));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">League Table</h1>
      {season && <p className="mb-6 text-gray-500">{season.name}</p>}
      <StandingsTable rows={rows} teamsById={teamsById} />
      <p className="mt-4 text-xs text-gray-400">
        2 points for a win, 1 for a draw. Ties broken by frame difference, then frames for.
      </p>
    </div>
  );
}
