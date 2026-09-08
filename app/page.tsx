import Link from "next/link";
import { getCurrentSeason, getFixtures, getPublishedNews } from "@/lib/data";
import { FixtureList } from "@/components/FixtureList";

export default async function HomePage() {
  const season = await getCurrentSeason();
  const fixtures = season ? await getFixtures(season.id) : [];
  const news = await getPublishedNews();

  const now = Date.now();
  const upcoming = fixtures
    .filter((f) => f.status === "scheduled" && new Date(f.scheduled_at).getTime() >= now)
    .slice(0, 5);
  const recentResults = fixtures
    .filter((f) => f.status === "played")
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-12">
      <section className="rounded-lg bg-felt px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">Rutland County Pool League</h1>
        <p className="mt-2 max-w-2xl text-gray-100">
          Fixtures, results, the league table and news for teams across
          Rutland{season ? ` — ${season.name}` : ""}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/table" className="rounded bg-gold px-4 py-2 font-semibold text-felt-dark">
            League Table
          </Link>
          <Link href="/fixtures" className="rounded border border-white px-4 py-2">
            Fixtures
          </Link>
        </div>
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xl font-semibold">Upcoming fixtures</h2>
          <FixtureList fixtures={upcoming} />
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold">Recent results</h2>
          <FixtureList fixtures={recentResults} />
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest news</h2>
          <Link href="/news" className="text-sm text-felt hover:underline">
            View all
          </Link>
        </div>
        {news.length === 0 ? (
          <p className="text-gray-500">No news posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {news.slice(0, 3).map((post) => (
              <li key={post.id}>
                <Link href={`/news/${post.slug}`} className="font-medium hover:underline">
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {new Date(post.published_at).toLocaleDateString("en-GB")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
