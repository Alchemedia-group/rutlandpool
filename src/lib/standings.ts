export type FixtureResult = {
  home_team_id: string;
  away_team_id: string;
  home_frames: number | null;
  away_frames: number | null;
  status: string;
};

export type TeamRow = {
  team_id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  framesFor: number;
  framesAgainst: number;
  points: number;
};

/**
 * RCPL 26/27 scoring: 1 point per frame won — an 8-1 match win scores 8
 * points for the winner and 1 for the loser. No bonus points.
 */
export function computeStandings(
  teamIds: string[],
  fixtures: FixtureResult[]
): TeamRow[] {
  const rows = new Map<string, TeamRow>(
    teamIds.map((id) => [
      id,
      {
        team_id: id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        framesFor: 0,
        framesAgainst: 0,
        points: 0,
      },
    ])
  );

  for (const fixture of fixtures) {
    if (
      fixture.status !== "played" ||
      fixture.home_frames === null ||
      fixture.away_frames === null
    ) {
      continue;
    }

    const home = rows.get(fixture.home_team_id);
    const away = rows.get(fixture.away_team_id);
    if (!home || !away) continue;

    const hf = fixture.home_frames;
    const af = fixture.away_frames;

    home.played += 1;
    away.played += 1;
    home.framesFor += hf;
    home.framesAgainst += af;
    away.framesFor += af;
    away.framesAgainst += hf;

    home.points += hf;
    away.points += af;

    if (hf > af) {
      home.won += 1;
      away.lost += 1;
    } else if (af > hf) {
      away.won += 1;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
    }
  }

  return Array.from(rows.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aDiff = a.framesFor - a.framesAgainst;
    const bDiff = b.framesFor - b.framesAgainst;
    if (bDiff !== aDiff) return bDiff - aDiff;
    return b.framesFor - a.framesFor;
  });
}
