import { notFound } from "next/navigation";
import { getFixturesForTeam, getTeamBySlug } from "@/lib/data";
import { FixtureList } from "@/components/FixtureList";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const fixtures = await getFixturesForTeam(team.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">{team.name}</h1>
      {team.venue && <p className="mt-1 text-gray-500">Home venue: {team.venue}</p>}

      <h2 className="mb-3 mt-8 text-xl font-semibold">Fixtures &amp; results</h2>
      <FixtureList fixtures={fixtures} />
    </div>
  );
}
