import Link from "next/link";
import { getCurrentSeason, getFixtures, getTeams } from "@/lib/data";
import {
  createFixture,
  deleteFixture,
  recordResult,
  setFixtureStatus,
} from "../actions";

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default async function AdminFixturesPage() {
  const season = await getCurrentSeason();
  const teams = await getTeams();
  const fixtures = season ? await getFixtures(season.id) : [];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Fixtures &amp; results</h1>

      {!season || teams.length < 2 ? (
        <p className="text-gray-500">
          Set a current season and add at least two teams before scheduling fixtures.
        </p>
      ) : (
        <form action={createFixture} className="mb-10 grid max-w-lg gap-3">
          <input type="hidden" name="season_id" value={season.id} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Home team</label>
              <select name="home_team_id" required className="mt-1 w-full rounded border border-gray-300 px-3 py-2">
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Away team</label>
              <select name="away_team_id" required className="mt-1 w-full rounded border border-gray-300 px-3 py-2">
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Date &amp; time</label>
            <input
              type="datetime-local"
              name="scheduled_at"
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Venue (optional)</label>
            <input name="venue" className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </div>
          <button type="submit" className="rounded bg-felt px-4 py-2 text-white">
            Add fixture
          </button>
        </form>
      )}

      <ul className="divide-y divide-gray-200">
        {fixtures.map((fixture) => (
          <li key={fixture.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">
                  {fixture.home_team.name} vs {fixture.away_team.name}
                </p>
                <p className="text-sm text-gray-500">
                  {toLocalInputValue(fixture.scheduled_at).replace("T", " ")}
                  {fixture.venue ? ` · ${fixture.venue}` : ""} · {fixture.status}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/fixtures/${fixture.id}`} className="text-sm text-felt hover:underline">
                  Frames
                </Link>
                <form action={deleteFixture}>
                  <input type="hidden" name="id" value={fixture.id} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4">
              <form action={recordResult} className="flex items-center gap-2">
                <input type="hidden" name="id" value={fixture.id} />
                <input
                  type="number"
                  min={0}
                  name="home_frames"
                  defaultValue={fixture.home_frames ?? undefined}
                  placeholder="Home"
                  className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <span className="text-sm text-gray-500">–</span>
                <input
                  type="number"
                  min={0}
                  name="away_frames"
                  defaultValue={fixture.away_frames ?? undefined}
                  placeholder="Away"
                  className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <button type="submit" className="rounded bg-felt-dark px-3 py-1 text-sm text-white">
                  Save result
                </button>
              </form>

              {fixture.status !== "played" && (
                <form action={setFixtureStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={fixture.id} />
                  <select name="status" defaultValue={fixture.status} className="rounded border border-gray-300 px-2 py-1 text-sm">
                    <option value="scheduled">Scheduled</option>
                    <option value="postponed">Postponed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button type="submit" className="text-sm text-felt hover:underline">
                    Update
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
