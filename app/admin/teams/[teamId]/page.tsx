import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlayersForTeam } from "@/lib/data";
import type { Team } from "@/lib/types";
import { createPlayer, deletePlayer, updateTeam } from "../../actions";

export default async function AdminTeamSquadPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const supabase = await createClient();
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .maybeSingle<Team>();
  if (!team) notFound();

  const players = await getPlayersForTeam(teamId);

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">{team.name}</h1>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Edit team</h2>
        <form action={updateTeam} className="grid max-w-lg gap-3">
          <input type="hidden" name="id" value={team.id} />
          <div>
            <label className="block text-sm font-medium">Team name</label>
            <input
              name="name"
              defaultValue={team.name}
              required
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Venue (short, e.g. "The Vaults, Uppingham")</label>
            <input
              name="venue"
              defaultValue={team.venue ?? ""}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Venue address</label>
            <input
              name="venue_address"
              defaultValue={team.venue_address ?? ""}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Venue phone</label>
            <input
              name="venue_phone"
              defaultValue={team.venue_phone ?? ""}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Opening hours</label>
            <input
              name="venue_hours"
              defaultValue={team.venue_hours ?? ""}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Venue description</label>
            <textarea
              name="venue_description"
              defaultValue={team.venue_description ?? ""}
              rows={3}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Map link</label>
            <input
              name="venue_map_url"
              defaultValue={team.venue_map_url ?? ""}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
            />
          </div>
          <button type="submit" className="w-fit rounded bg-felt px-4 py-2 text-white">
            Save team
          </button>
        </form>
      </section>

      <h2 className="mb-1 text-lg font-semibold">Squad</h2>
      <p className="mb-6 text-sm text-ink/50">
        Players added here become selectable when entering frame results for this team's fixtures.
      </p>

      <form action={createPlayer} className="mb-8 flex flex-wrap items-end gap-3">
        <input type="hidden" name="team_id" value={team.id} />
        <div>
          <label className="block text-sm font-medium">Player name</label>
          <input name="name" required className="mt-1 w-full rounded border border-ink/15 px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="is_captain" />
          Captain
        </label>
        <button type="submit" className="rounded bg-felt px-4 py-2 text-white">
          Add player
        </button>
      </form>

      <ul className="divide-y divide-ink/10">
        {players.map((player) => (
          <li key={player.id} className="flex items-center justify-between py-3">
            <span>
              {player.name}
              {player.is_captain && <span className="ml-2 text-xs text-ink/40">(c)</span>}
            </span>
            <form action={deletePlayer}>
              <input type="hidden" name="id" value={player.id} />
              <input type="hidden" name="team_id" value={team.id} />
              <button type="submit" className="text-sm text-loss hover:underline">
                Remove
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
