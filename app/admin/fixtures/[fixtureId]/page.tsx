import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFramesForFixture, getPlayersForTeam } from "@/lib/data";
import type { Fixture, Team } from "@/lib/types";
import { deleteFrame, saveFrame } from "../../actions";

type FixtureWithTeams = Fixture & { home_team: Team; away_team: Team };

export default async function AdminFixtureFramesPage({
  params,
}: {
  params: Promise<{ fixtureId: string }>;
}) {
  const { fixtureId } = await params;
  const supabase = await createClient();
  const { data: fixture } = await supabase
    .from("fixtures")
    .select("*, home_team:home_team_id(*), away_team:away_team_id(*)")
    .eq("id", fixtureId)
    .maybeSingle<FixtureWithTeams>();
  if (!fixture) notFound();

  const [homePlayers, awayPlayers, frames] = await Promise.all([
    getPlayersForTeam(fixture.home_team_id),
    getPlayersForTeam(fixture.away_team_id),
    getFramesForFixture(fixtureId),
  ]);
  const framesByNumber = new Map(frames.map((f) => [f.frame_number, f]));

  const missingPlayers = homePlayers.length === 0 || awayPlayers.length === 0;

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">
        {fixture.home_team.name} v {fixture.away_team.name}
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {new Date(fixture.scheduled_at).toLocaleString("en-GB")} — frame-by-frame results
      </p>

      {missingPlayers && (
        <p className="mb-6 rounded bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Add players to both squads (Admin → Teams → Squad) before entering frames.
        </p>
      )}

      <div className="space-y-4">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((frameNumber) => (
          <FrameRow
            key={frameNumber}
            fixtureId={fixtureId}
            frameNumber={frameNumber}
            existing={framesByNumber.get(frameNumber)}
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
          />
        ))}
      </div>
    </div>
  );
}

function FrameRow({
  fixtureId,
  frameNumber,
  existing,
  homePlayers,
  awayPlayers,
}: {
  fixtureId: string;
  frameNumber: number;
  existing?: { id: string; frame_type: string; home_players: string[]; away_players: string[]; winner: string | null; break_win: boolean };
  homePlayers: { id: string; name: string }[];
  awayPlayers: { id: string; name: string }[];
}) {
  const defaultType = frameNumber === 9 ? "decider" : frameNumber === 4 || frameNumber === 8 ? "doubles" : "singles";

  return (
    <form
      action={saveFrame}
      className="rounded border border-gray-200 p-4"
    >
      <input type="hidden" name="fixture_id" value={fixtureId} />
      <input type="hidden" name="frame_number" value={frameNumber} />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold">Frame {frameNumber}</span>
        <select
          name="frame_type"
          defaultValue={existing?.frame_type ?? defaultType}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="singles">Singles</option>
          <option value="doubles">Doubles</option>
          <option value="decider">Decider</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-gray-500">Home players</p>
          <PlayerSelects
            namePrefix="home_player"
            players={homePlayers}
            selected={existing?.home_players ?? []}
          />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-gray-500">Away players</p>
          <PlayerSelects
            namePrefix="away_player"
            players={awayPlayers}
            selected={existing?.away_players ?? []}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name="winner"
            value="home"
            defaultChecked={existing?.winner === "home"}
          />
          Home won
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name="winner"
            value="away"
            defaultChecked={existing?.winner === "away"}
          />
          Away won
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" name="break_win" defaultChecked={existing?.break_win} />
          Won on the break
        </label>
        <button type="submit" className="rounded bg-felt-dark px-3 py-1 text-sm text-white">
          Save
        </button>
        {existing && (
          <button
            formAction={deleteFrame}
            name="id"
            value={existing.id}
            className="text-sm text-red-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}

function PlayerSelects({
  namePrefix,
  players,
  selected,
}: {
  namePrefix: string;
  players: { id: string; name: string }[];
  selected: string[];
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {[0, 1].map((slot) => (
        <select
          key={slot}
          name={`${namePrefix}_${slot + 1}`}
          defaultValue={selected[slot] ?? ""}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">{slot === 0 ? "— select —" : "(doubles partner)"}</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
