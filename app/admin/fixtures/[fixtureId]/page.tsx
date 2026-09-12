import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFramesForFixture, getPlayersForTeam } from "@/lib/data";
import { FRAME_COUNT, frameTypeForNumber } from "@/lib/frames";
import type { Fixture, Team } from "@/lib/types";
import { saveMatch } from "../../actions";

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
  const playersById = new Map([...homePlayers, ...awayPlayers].map((p) => [p.id, p.name]));

  const homeDatalistId = `players-${fixture.home_team_id}`;
  const awayDatalistId = `players-${fixture.away_team_id}`;

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">
        {fixture.home_team.name} v {fixture.away_team.name}
      </h1>
      <p className="mb-6 text-sm text-ink/50">
        {new Date(fixture.scheduled_at).toLocaleString("en-GB")} — frame-by-frame results
      </p>

      <p className="mb-4 rounded bg-cream-card px-4 py-3 text-sm text-ink/70">
        Type a name — pick from the squad list as you type, or type someone new if they're
        standing in. Fill in as many frames as you know and tick who won each one; the match score
        and league table update automatically. Frames 1–6 are singles, 7–9 are doubles.
      </p>

      <datalist id={homeDatalistId}>
        {homePlayers.map((p) => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>
      <datalist id={awayDatalistId}>
        {awayPlayers.map((p) => (
          <option key={p.id} value={p.name} />
        ))}
      </datalist>

      <form action={saveMatch}>
        <input type="hidden" name="fixture_id" value={fixtureId} />
        <input type="hidden" name="home_team_id" value={fixture.home_team_id} />
        <input type="hidden" name="away_team_id" value={fixture.away_team_id} />

        <div className="overflow-x-auto rounded-lg border border-ink/10">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/15 bg-cream-card text-left text-ink/50">
                <th className="w-8 py-2 pl-3 pr-1">#</th>
                <th className="py-2 pr-2">Home</th>
                <th className="py-2 pr-2">Away</th>
                <th className="w-20 py-2 pr-3 text-center">Won</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: FRAME_COUNT }, (_, i) => i + 1).map((frameNumber) => (
                <FrameRow
                  key={frameNumber}
                  frameNumber={frameNumber}
                  existing={framesByNumber.get(frameNumber)}
                  playersById={playersById}
                  homeDatalistId={homeDatalistId}
                  awayDatalistId={awayDatalistId}
                />
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="mt-4 rounded bg-felt-dark px-4 py-2 text-sm font-semibold text-white"
        >
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
  existing?: { home_players: string[]; away_players: string[]; winner: string | null };
  playersById: Map<string, string>;
  homeDatalistId: string;
  awayDatalistId: string;
}) {
  const isDoubles = frameTypeForNumber(frameNumber) === "doubles";
  const homeNames = existing?.home_players.map((id) => playersById.get(id) ?? "") ?? [];
  const awayNames = existing?.away_players.map((id) => playersById.get(id) ?? "") ?? [];

  return (
    <tr className="border-b border-ink/5 align-top">
      <td className="py-2 pl-3 pr-1 text-ink/40">{frameNumber}</td>
      <td className="py-2 pr-2">
        <NameInputs
          namePrefix={`frame_${frameNumber}_home`}
          datalistId={homeDatalistId}
          values={homeNames}
          slots={isDoubles ? 2 : 1}
        />
      </td>
      <td className="py-2 pr-2">
        <NameInputs
          namePrefix={`frame_${frameNumber}_away`}
          datalistId={awayDatalistId}
          values={awayNames}
          slots={isDoubles ? 2 : 1}
        />
      </td>
      <td className="py-2 pr-3">
        <div className="flex justify-center gap-2">
          <label className="flex items-center gap-0.5 text-xs" title="Home won">
            <input
              type="radio"
              name={`frame_${frameNumber}_winner`}
              value="home"
              defaultChecked={existing?.winner === "home"}
            />
            H
          </label>
          <label className="flex items-center gap-0.5 text-xs" title="Away won">
            <input
              type="radio"
              name={`frame_${frameNumber}_winner`}
              value="away"
              defaultChecked={existing?.winner === "away"}
            />
            A
          </label>
        </div>
      </td>
    </tr>
  );
}

function NameInputs({
  namePrefix,
  datalistId,
  values,
  slots,
}: {
  namePrefix: string;
  datalistId: string;
  values: string[];
  slots: 1 | 2;
}) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: slots }, (_, slot) => (
        <input
          key={slot}
          type="text"
          name={`${namePrefix}_${slot + 1}`}
          list={datalistId}
          defaultValue={values[slot] ?? ""}
          placeholder={slot === 0 ? "Player name" : "Partner"}
          className="w-full min-w-[110px] rounded border border-ink/15 px-2 py-1 text-sm"
          autoComplete="off"
        />
      ))}
    </div>
  );
}
