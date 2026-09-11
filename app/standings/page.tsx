import { getCurrentSeason, getRawFixtures, getTeams } from "@/lib/data";
import { computeStandings } from "@/lib/standings";
import { StandingsTable } from "@/components/StandingsTable";

export default async function StandingsPage() {
  const season = await getCurrentSeason();
  const teams = await getTeams();
  const fixtures = season ? await getRawFixtures(season.id) : [];

  const teamIds = teams.map((t) => t.id);
  const rows = computeStandings(teamIds, fixtures);
  const teamsById = new Map(teams.map((t) => [t.id, t]));

  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold">
        Division One
        <span className="flex items-center gap-1 text-sm font-sans font-normal text-felt">
          <span className="h-1.5 w-1.5 rounded-full bg-felt" /> Live
        </span>
      </h1>
      {season && <p className="mb-6 text-ink/50">{season.name}</p>}
      <StandingsTable rows={rows} teamsById={teamsById} />
      <p className="mt-4 text-xs text-ink/40">
        2 points per frame won, 1 per frame lost, 5 for the match. Ties broken by frame difference, then frames for.
      </p>
    </div>
  );
}
