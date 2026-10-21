import { TournamentBracket } from "@/components/TournamentBracket";
import {
  tournamentDoublesRound1,
  tournamentEntryFees,
  tournamentRound1Deadline,
  tournamentSinglesRound1,
} from "@/lib/tournamentsData";

export default function TournamentsPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Singles &amp; Doubles Tournament</h1>
      <p className="mb-6 text-ink/50">
        A knockout running alongside the league. Results here do not count towards league
        points, standings or stats.
      </p>

      <div className="mb-8 rounded-lg border border-ink/10 bg-cream-card p-4">
        <p className="font-display text-xs font-bold uppercase tracking-wide text-ink/50">
          Round 1
        </p>
        <p className="mt-1 font-display text-lg font-bold text-felt">
          Play by {formatDate(tournamentRound1Deadline)}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">All matches are best of 3 frames.</p>
        <p className="mt-1 text-sm text-ink/70">
          Players arrange their own match with their opponent and agree a referee, or ask the
          league to allocate one. Round 2 fixtures are posted here once every Round 1 result is in.
        </p>
      </div>

      <TournamentBracket singles={tournamentSinglesRound1} doubles={tournamentDoublesRound1} />

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 font-display text-lg font-bold">Entry &amp; prizes</h2>
          <p className="text-sm leading-relaxed text-ink/80">
            Entry is £{tournamentEntryFees.singles} for the singles and £
            {tournamentEntryFees.doubles} for the doubles. Prize money is 70% of each
            tournament&apos;s entry fees — two-thirds to the winners, one-third to the
            runners-up.
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-lg font-bold">How it works</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink/80">
            <li>Every match, singles and doubles, is best of 3 frames.</li>
            <li>Contact your opponent and agree a time, venue and referee before the deadline.</li>
            <li>Send the score to the league once your match is played.</li>
            <li>Winners go through — the next round is drawn once every result is in.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
