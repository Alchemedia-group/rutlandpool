import Link from "next/link";
import { getTeams } from "@/lib/data";

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Teams</h1>
      {teams.length === 0 ? (
        <p className="text-gray-500">No teams have been added yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {teams.map((team) => (
            <li key={team.id} className="rounded border border-gray-200 p-4">
              <Link href={`/teams/${team.slug}`} className="font-semibold hover:underline">
                {team.name}
              </Link>
              {team.venue && <p className="text-sm text-gray-500">{team.venue}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
