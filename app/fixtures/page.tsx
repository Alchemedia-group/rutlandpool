import { getCurrentSeason, getFixtures } from "@/lib/data";
import { FixtureList } from "@/components/FixtureList";
import { byeTeam } from "@/lib/format";

export default async function FixturesPage() {
  const season = await getCurrentSeason();
  const fixtures = season ? await getFixtures(season.id) : [];
  const now = Date.now();
  const upcoming = fixtures.filter(
    (f) => f.status !== "played" && !(byeTeam(f) && new Date(f.scheduled_at).getTime() < now)
  );

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Fixtures</h1>
      {season && <p className="mb-6 text-ink/50">{season.name}</p>}
      <FixtureList fixtures={upcoming} />
    </div>
  );
}
