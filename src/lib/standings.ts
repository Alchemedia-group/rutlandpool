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

const POINTS_FOR_WIN = 2;
const POINTS_FOR_DRAW = 1;

/**
 * Standard UK pub-league scoring: 2 points for a match win, 1 each for a
 * draw (equal frames), 0 for a loss. Frame difference is the tiebreaker.
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

    home.played += 1;
    away.played += 1;
    home.framesFor += fixture.home_frames;
    home.framesAgainst += fixture.away_frames;
    away.framesFor += fixture.away_frames;
    away.framesAgainst += fixture.home_frames;

    if (fixture.home_frames > fixture.away_frames) {
      home.won += 1;
      home.points += POINTS_FOR_WIN;
      away.lost += 1;
    } else if (fixture.home_frames < fixture.away_frames) {
      away.won += 1;
      away.points += POINTS_FOR_WIN;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += POINTS_FOR_DRAW;
      away.points += POINTS_FOR_DRAW;
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
