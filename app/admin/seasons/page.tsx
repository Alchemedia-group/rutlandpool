import { createClient } from "@/lib/supabase/server";
import type { Season } from "@/lib/types";
import { createSeason, setCurrentSeason } from "../actions";

export default async function AdminSeasonsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .order("created_at", { ascending: false });
  const seasons = (data as Season[]) ?? [];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">Seasons</h1>

      <form action={createSeason} className="mb-8 flex gap-2">
        <input
          name="name"
          placeholder="e.g. 2026/27"
          required
          className="rounded border border-ink/15 px-3 py-2"
        />
        <button type="submit" className="rounded bg-felt px-4 py-2 text-white">
          Add season
        </button>
      </form>

      <ul className="divide-y divide-ink/10">
        {seasons.map((season) => (
          <li key={season.id} className="flex items-center justify-between py-3">
            <span>
              {season.name}
              {season.is_current && (
                <span className="ml-2 rounded bg-felt px-2 py-0.5 text-xs text-white">
                  current
                </span>
              )}
            </span>
            {!season.is_current && (
              <form action={setCurrentSeason}>
                <input type="hidden" name="id" value={season.id} />
                <button type="submit" className="text-sm text-felt hover:underline">
                  Make current
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
