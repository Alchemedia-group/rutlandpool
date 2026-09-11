import { getCurrentSeason, getFixtures } from "@/lib/data";
import { FixtureList } from "@/components/FixtureList";

export default async function ResultsPage() {
  const season = await getCurrentSeason();
  const fixtures = season ? await getFixtures(season.id) : [];
  const played = fixtures
    .filter((f) => f.status === "played")
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Results</h1>
      {season && <p className="mb-6 text-ink/50">{season.name}</p>}
      <FixtureList fixtures={played} />
    </div>
  );
}
