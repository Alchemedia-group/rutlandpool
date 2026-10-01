import Link from "next/link";
import { getTeams } from "@/lib/data";
import type { Team } from "@/lib/types";

type VenueGroup = {
  key: string;
  venue: string | null;
  venue_address: string | null;
  venue_phone: string | null;
  venue_hours: string | null;
  venue_description: string | null;
  venue_map_url: string | null;
  teams: Team[];
};

function groupByVenue(teams: Team[]): VenueGroup[] {
  const groups = new Map<string, VenueGroup>();

  for (const team of teams) {
    if (!team.venue) continue;
    const key = team.venue_address ?? team.venue;
    const existing = groups.get(key);
    if (existing) {
      existing.teams.push(team);
    } else {
      groups.set(key, {
        key,
        venue: team.venue,
        venue_address: team.venue_address,
        venue_phone: team.venue_phone,
        venue_hours: team.venue_hours,
        venue_description: team.venue_description,
        venue_map_url: team.venue_map_url,
        teams: [team],
      });
    }
  }

  return Array.from(groups.values()).sort((a, b) =>
    (a.venue ?? "").localeCompare(b.venue ?? "")
  );
}

export default async function VenuesPage() {
  const teams = await getTeams();
  const groups = groupByVenue(teams);
  const withoutVenue = teams.filter((t) => !t.venue);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Venues</h1>
      <p className="mb-6 text-sm text-ink/50">
        All league matches start at 8pm on Wednesdays.
      </p>

      {groups.length === 0 ? (
        <p className="text-ink/50">No venues added yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {groups.map((group) => (
            <li key={group.key} className="rounded-lg border border-ink/10 p-4">
              <p className="font-display text-lg font-semibold">{group.venue}</p>
              {group.venue_address && (
                <p className="text-sm text-ink/60">{group.venue_address}</p>
              )}

              <p className="mt-2 text-sm text-ink/80">
                {group.teams.map((team, i) => (
                  <span key={team.id}>
                    {i > 0 && " · "}
                    <Link href={`/teams/${team.slug}`} className="text-felt underline">
                      {team.name}
                    </Link>
                  </span>
                ))}
              </p>

              {group.venue_description && (
                <p className="mt-3 text-sm text-ink/70">{group.venue_description}</p>
              )}

              <dl className="mt-3 space-y-1 text-sm text-ink/60">
                {group.venue_phone && (
                  <div className="flex gap-2">
                    <dt className="font-medium text-ink/80">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${group.venue_phone.replace(/\s+/g, "")}`}
                        className="text-felt underline"
                      >
                        {group.venue_phone}
                      </a>
                    </dd>
                  </div>
                )}
                {group.venue_hours && (
                  <div className="flex gap-2">
                    <dt className="font-medium text-ink/80">Hours</dt>
                    <dd>{group.venue_hours}</dd>
                  </div>
                )}
                {group.venue_map_url && (
                  <div className="flex gap-2">
                    <dt className="font-medium text-ink/80">Map</dt>
                    <dd>
                      <a
                        href={group.venue_map_url}
                        className="text-felt underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </li>
          ))}
        </ul>
      )}

      {withoutVenue.length > 0 && (
        <p className="mt-6 text-sm text-ink/40">
          Venue not yet confirmed for: {withoutVenue.map((t) => t.name).join(", ")}.
        </p>
      )}
    </div>
  );
}
