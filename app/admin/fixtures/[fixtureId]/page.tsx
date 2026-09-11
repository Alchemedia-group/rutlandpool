import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFramesForFixture, getPlayersForTeam } from "@/lib/data";
import type { Fixture, Team } from "@/lib/types";
import { saveMatch } from "../../actions";

type FixtureWithTeams = Fixture & { home_team: Team; away_team: Team };
type PlayerOption = { id: string; name: string };

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
  const playersById = new Map([...homePlayers, ...awayPlayers].map((p) => [p.id, p.name]));

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">
        {fixture.home_team.name} v {fixture.away_team.name}
      </h1>
      <p className="mb-6 text-sm text-ink/50">
        {new Date(fixture.scheduled_at).toLocaleString("en-GB")} — frame-by-frame results
      </p>

      <p className="mb-6 rounded bg-cream-card px-4 py-3 text-sm text-ink/70">
        Type a player's name for each frame — pick from the squad list as you type, or just type
        someone new if they're standing in. Enter results for as many frames as you know and hit
        Save; the match score and league table update from whichever frames have a winner ticked.
      </p>

      <datalist id={`players-${fixture.home_team_id}`}>
        {homePlayers.map((p) => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>
      <datalist id={`players-${fixture.away_team_id}`}>
        {awayPlayers.map((p) => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>

      <form action={saveMatch} className="space-y-4">
        <input type="hidden" name="fixture_id" value={fixtureId} />
        <input type="hidden" name="home_team_id" value={fixture.home_team_id} />
        <input type="hidden" name="away_team_id" value={fixture.away_team_id} />

        {Array.from({ length: 9 }, (_, i) => i + 1).map((frameNumber) => (
          <FrameRow
            key={frameNumber}
            frameNumber={frameNumber}
            existing={framesByNumber.get(frameNumber)}
            playersById={playersById}
            homeDatalistId={`players-${fixture.home_team_id}`}
            awayDatalistId={`players-${fixture.away_team_id}`}
          />
        ))}

        <button type="submit" className="rounded bg-felt-dark px-4 py-2 text-sm font-semibold text-white">
          Save match
        </button>
      </form>
    </div>
  );
}

function FrameRow({
  frameNumber,
  existing,
  playersById,
  homeDatalistId,
  awayDatalistId,
}: {
  frameNumber: number;
  existing?: { frame_type: string; home_players: string[]; away_players: string[]; winner: string | null; break_win: boolean };
  playersById: Map<string, string>;
  homeDatalistId: string;
  awayDatalistId: string;
}) {
  const defaultType = frameNumber === 9 ? "decider" : frameNumber === 4 || frameNumber === 8 ? "doubles" : "singles";
  const homeNames = existing?.home_players.map((id) => playersById.get(id) ?? "") ?? [];
  const awayNames = existing?.away_players.map((id) => playersById.get(id) ?? "") ?? [];

  return (
    <div className="rounded border border-ink/10 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold">Frame {frameNumber}</span>
        <select
          name={`frame_${frameNumber}_type`}
          defaultValue={existing?.frame_type ?? defaultType}
          className="rounded border border-ink/15 px-2 py-1 text-sm"
        >
          <option value="singles">Singles</option>
          <option value="doubles">Doubles</option>
          <option value="decider">Decider</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-ink/50">Home players</p>
          <NameInputs namePrefix={`frame_${frameNumber}_home`} datalistId={homeDatalistId} values={homeNames} />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-ink/50">Away players</p>
          <NameInputs namePrefix={`frame_${frameNumber}_away`} datalistId={awayDatalistId} values={awayNames} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name={`frame_${frameNumber}_winner`}
            value="home"
            defaultChecked={existing?.winner === "home"}
          />
          Home won
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name={`frame_${frameNumber}_winner`}
            value="away"
            defaultChecked={existing?.winner === "away"}
          />
          Away won
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            name={`frame_${frameNumber}_break_win`}
            defaultChecked={existing?.break_win}
          />
          Won on the break
        </label>
      </div>
    </div>
  );
}

function NameInputs({
  namePrefix,
  datalistId,
  values,
}: {
  namePrefix: string;
  datalistId: string;
  values: string[];
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {[0, 1].map((slot) => (
        <input
          key={slot}
          type="text"
          name={`${namePrefix}_${slot + 1}`}
          list={datalistId}
          defaultValue={values[slot] ?? ""}
          placeholder={slot === 0 ? "Player name" : "Doubles partner"}
          className="w-full rounded border border-ink/15 px-2 py-1 text-sm"
          autoComplete="off"
        />
      ))}
    </div>
  );
}
