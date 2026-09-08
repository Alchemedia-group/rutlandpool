import { getCurrentSeason, getFixtures } from "@/lib/data";
import { FixtureList } from "@/components/FixtureList";

export default async function FixturesPage() {
  const season = await getCurrentSeason();
  const fixtures = season ? await getFixtures(season.id) : [];
  const upcoming = fixtures.filter((f) => f.status !== "played");

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Fixtures</h1>
      {season && <p className="mb-6 text-gray-500">{season.name}</p>}
      <FixtureList fixtures={upcoming} />
    </div>
  );
}
