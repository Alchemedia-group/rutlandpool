import Link from "next/link";
import { getTeams } from "@/lib/data";

export default async function VenuesPage() {
  const teams = await getTeams();
  const withVenue = teams.filter((t) => t.venue);
  const withoutVenue = teams.filter((t) => !t.venue);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Venues</h1>

      {withVenue.length === 0 ? (
        <p className="text-gray-500">No venues added yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {withVenue.map((team) => (
            <li key={team.id} className="rounded border border-gray-200 p-4">
              <Link href={`/teams/${team.slug}`} className="font-semibold hover:underline">
                {team.name}
              </Link>
              <p className="text-sm text-gray-500">{team.venue}</p>
            </li>
          ))}
        </ul>
      )}

      {withoutVenue.length > 0 && (
        <p className="mt-6 text-sm text-gray-400">
          Venue not yet confirmed for: {withoutVenue.map((t) => t.name).join(", ")}.
        </p>
      )}
    </div>
  );
}
