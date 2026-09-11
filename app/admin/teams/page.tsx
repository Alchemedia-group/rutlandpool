import Link from "next/link";
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
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Venue (optional)</label>
          <input
            name="venue"
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
          />
        </div>
        <button type="submit" className="rounded bg-felt px-4 py-2 text-white">
          Add team
        </button>
      </form>

      <ul className="divide-y divide-ink/10">
        {teams.map((team) => (
          <li key={team.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{team.name}</p>
              {team.venue && <p className="text-sm text-ink/50">{team.venue}</p>}
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/teams/${team.id}`} className="text-sm text-felt hover:underline">
                Squad
              </Link>
              <form action={deleteTeam}>
                <input type="hidden" name="id" value={team.id} />
                <button type="submit" className="text-sm text-loss hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
