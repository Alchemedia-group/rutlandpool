export default function ContactPage() {
  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Contact</h1>
      <p className="text-ink/80">
        For fixture queries, team entries, or anything else, get in touch with
        the league committee.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded border border-ink/15 px-4 py-3">
          <p className="font-semibold">League President</p>
          <p className="text-ink/80">Sean Easton</p>
          <p className="text-ink/80">
            <a href="tel:07720749129" className="text-felt underline">
              07720 749129
            </a>
          </p>
        </div>
        <div className="rounded border border-ink/15 px-4 py-3">
          <p className="font-semibold">League Vice President</p>
          <p className="text-ink/80">Kelly Easton</p>
          <p className="text-ink/80">
            <a href="tel:07725739364" className="text-felt underline">
              07725 739364
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
