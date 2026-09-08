import Link from "next/link";
import type { FixtureWithTeams } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function FixtureList({ fixtures }: { fixtures: FixtureWithTeams[] }) {
  if (fixtures.length === 0) {
    return <p className="text-gray-500">No fixtures to show yet.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {fixtures.map((fixture) => (
        <li key={fixture.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
          <div>
            <p className="font-medium">
              <Link href={`/teams/${fixture.home_team.slug}`} className="hover:underline">
                {fixture.home_team.name}
              </Link>
              {" vs "}
              <Link href={`/teams/${fixture.away_team.slug}`} className="hover:underline">
                {fixture.away_team.name}
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(fixture.scheduled_at)}
              {fixture.venue ? ` · ${fixture.venue}` : ""}
              {fixture.status !== "scheduled" && fixture.status !== "played"
                ? ` · ${fixture.status}`
                : ""}
            </p>
          </div>
          {fixture.status === "played" && (
            <div className="rounded bg-felt px-3 py-1 text-sm font-semibold text-white">
              {fixture.home_frames} – {fixture.away_frames}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
