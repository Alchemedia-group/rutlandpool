export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">About the League</h1>
      <p className="text-gray-700">
        The Rutland County Pool League brings together pub and club teams from
        across Rutland to compete throughout the season. Fixtures are played
        weekly, with results and the league table updated here as the season
        progresses.
      </p>
      <p className="mt-4 text-gray-700">
        Interested in entering a team? Get in touch via the{" "}
        <a href="/contact" className="text-felt underline">
          contact page
        </a>
        .
      </p>
    </div>
  );
}
