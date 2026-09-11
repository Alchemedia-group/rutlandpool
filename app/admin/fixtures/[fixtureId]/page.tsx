import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFramesForFixture, getPlayersForTeam } from "@/lib/data";
import type { Fixture, Team } from "@/lib/types";
import { clearScoresheet, deleteFrame, saveFrame, uploadScoresheet } from "../../actions";

// OCR extraction can take longer than the default function timeout, and
// this also covers the Server Actions invoked from this page.
export const maxDuration = 60;

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
  const suggestions = fixture.scoresheet_suggestions;

  const missingPlayers = homePlayers.length === 0 || awayPlayers.length === 0;

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">
        {fixture.home_team.name} v {fixture.away_team.name}
      </h1>
      <p className="mb-6 text-sm text-ink/50">
        {new Date(fixture.scheduled_at).toLocaleString("en-GB")} — frame-by-frame results
      </p>

      {missingPlayers && (
        <p className="mb-6 rounded bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Add players to both squads (Admin → Teams → Squad) before entering frames.
        </p>
      )}

      <ScoresheetPanel fixtureId={fixtureId} scoresheetUrl={fixture.scoresheet_url} hasSuggestions={!!suggestions} />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {fixture.scoresheet_url && (
          <div className="lg:sticky lg:top-4 lg:self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fixture.scoresheet_url}
              alt="Uploaded scoresheet"
              className="w-full rounded border border-ink/10"
            />
          </div>
        )}

        <div className="space-y-4">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((frameNumber) => {
            const existing = framesByNumber.get(frameNumber);
            const suggestedHomeId = existing ? null : suggestions?.home?.[frameNumber - 1] ?? null;
            const suggestedAwayId = existing ? null : suggestions?.away?.[frameNumber - 1] ?? null;
            return (
              <FrameRow
                key={frameNumber}
                fixtureId={fixtureId}
                frameNumber={frameNumber}
                existing={existing}
                suggestedHomeId={suggestedHomeId}
                suggestedAwayId={suggestedAwayId}
                homePlayers={homePlayers}
                awayPlayers={awayPlayers}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScoresheetPanel({
  fixtureId,
  scoresheetUrl,
  hasSuggestions,
}: {
  fixtureId: string;
  scoresheetUrl: string | null;
  hasSuggestions: boolean;
}) {
  return (
    <div className="mb-6 rounded border border-ink/10 bg-cream-card p-4">
      <p className="mb-2 text-sm font-semibold">Scoresheet photo</p>
      <form action={uploadScoresheet} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="fixture_id" value={fixtureId} />
        <input
          type="file"
          name="photo"
          accept="image/*"
          capture="environment"
          required
          className="text-sm"
        />
        <button type="submit" className="rounded bg-felt-dark px-3 py-1.5 text-sm text-white">
          Upload &amp; scan
        </button>
        {scoresheetUrl && (
          <button
            formAction={clearScoresheet}
            formNoValidate
            className="text-sm text-loss hover:underline"
          >
            Remove photo
          </button>
        )}
      </form>
      {hasSuggestions && (
        <p className="mt-2 text-xs text-ink/50">
          Player names below were guessed from the photo and may be wrong — check every row
          against the photo before saving. Winners and scores are never guessed; tick those
          yourself.
        </p>
      )}
    </div>
  );
}

function FrameRow({
  fixtureId,
  frameNumber,
  existing,
  suggestedHomeId,
  suggestedAwayId,
  homePlayers,
  awayPlayers,
}: {
  fixtureId: string;
  frameNumber: number;
  existing?: { id: string; frame_type: string; home_players: string[]; away_players: string[]; winner: string | null; break_win: boolean };
  suggestedHomeId: string | null;
  suggestedAwayId: string | null;
  homePlayers: { id: string; name: string }[];
  awayPlayers: { id: string; name: string }[];
}) {
  const defaultType = frameNumber === 9 ? "decider" : frameNumber === 4 || frameNumber === 8 ? "doubles" : "singles";
  const suggested = !existing && (suggestedHomeId || suggestedAwayId);

  return (
    <form
      action={saveFrame}
      className={`rounded border p-4 ${suggested ? "border-gold/50 bg-gold/5" : "border-ink/10"}`}
    >
      <input type="hidden" name="fixture_id" value={fixtureId} />
      <input type="hidden" name="frame_number" value={frameNumber} />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold">
          Frame {frameNumber}
          {suggested && <span className="ml-2 text-xs font-normal text-gold">suggested from photo</span>}
        </span>
        <select
          name="frame_type"
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
          <PlayerSelects
            namePrefix="home_player"
            players={homePlayers}
            selected={existing?.home_players ?? (suggestedHomeId ? [suggestedHomeId] : [])}
          />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-ink/50">Away players</p>
          <PlayerSelects
            namePrefix="away_player"
            players={awayPlayers}
            selected={existing?.away_players ?? (suggestedAwayId ? [suggestedAwayId] : [])}
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
            className="text-sm text-loss hover:underline"
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
          className="rounded border border-ink/15 px-2 py-1 text-sm"
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
