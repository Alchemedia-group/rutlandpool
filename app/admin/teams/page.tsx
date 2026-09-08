import { getTeams } from "@/lib/data";
import { createTeam, deleteTeam } from "../actions";

export default async function AdminTeamsPage() {
  const teams = await getTeams();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Teams</h1>

      <form action={createTeam} className="mb-8 grid max-w-md gap-3">
        <div>
          <label className="block text-sm font-medium">Team name</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Venue (optional)</label>
          <input
            name="venue"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button type="submit" className="rounded bg-felt px-4 py-2 text-white">
          Add team
        </button>
      </form>

      <ul className="divide-y divide-gray-200">
        {teams.map((team) => (
          <li key={team.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{team.name}</p>
              {team.venue && <p className="text-sm text-gray-500">{team.venue}</p>}
            </div>
            <form action={deleteTeam}>
              <input type="hidden" name="id" value={team.id} />
              <button type="submit" className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
