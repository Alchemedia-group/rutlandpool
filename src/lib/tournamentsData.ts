// Singles & Doubles knockout, run alongside the league (AGM 2026 — "Doubles
// and Singles Buy-In Tournaments", src/lib/agmData.ts). Opponents arrange
// their own match within the round's deadline; results here are separate
// from league points, standings and stats.

// Once a tie is played, set `winner` (1 or 2 = which side won) and, if known,
// `score` as "2-1" from the winner's side. The loser is shown struck through.
export type TieResult = {
  winner?: 1 | 2;
  score?: string;
};

export type TournamentSinglesTie = TieResult & {
  id: string;
  player1: string;
  player2: string;
};

export type TournamentDoublesTie = TieResult & {
  id: string;
  pair1: [string, string];
  pair2: [string, string];
};

export const tournamentRound1Deadline = "2026-11-21"; // 1 month from the draw, not 2 weeks

export const tournamentEntryFees = { singles: 3, doubles: 5 };

export const tournamentSinglesRound1: TournamentSinglesTie[] = [
  { id: "s1", player1: "Will Howe", player2: "Jack Towell" },
  { id: "s2", player1: "Leanne Robbins", player2: "Steve Brawn", winner: 1, score: "2-1" },
  { id: "s3", player1: "Stuart Saddington", player2: "Andy Saddington", winner: 1, score: "2-1" },
  { id: "s4", player1: "Freddy Williamson", player2: "Mel Guest", winner: 2, score: "2-1" },
  { id: "s5", player1: "Lawrence Allison", player2: "Mo Bateman", winner: 1, score: "2-0" },
  { id: "s6", player1: "Kevin Southwell", player2: "John Robertson", winner: 2, score: "2-0" },
  { id: "s7", player1: "Rhys Hughes", player2: "Shaun Bennet", winner: 1, score: "2-1" },
  { id: "s8", player1: "Lewis Fitches", player2: "Ian Saddington", winner: 2, score: "2-0" },
  { id: "s9", player1: "Kelly Easton", player2: "Ollie Webb" },
  { id: "s10", player1: "Carl Simpson", player2: "Sam Blackwell" },
  { id: "s11", player1: "Brennan Kirby", player2: "Jamie Saddington", winner: 2, score: "2-1" },
  { id: "s12", player1: "Rob Barker", player2: "Cam Saddington" },
  { id: "s13", player1: "Graeme Douglas", player2: "Paul Dear", winner: 1, score: "2-1" },
  { id: "s14", player1: "Wayne Clarke", player2: "Mark Roberts", winner: 2, score: "2-1" },
  { id: "s15", player1: "Scott Webb", player2: "Mikie Hone", winner: 1, score: "2-0" },
  { id: "s16", player1: "Sam Mcall", player2: "Remi Sadio", winner: 1, score: "2-1" },
  { id: "s17", player1: "Andy Dougie Robb", player2: "Wayne Bloxham", winner: 2, score: "2-1" },
  { id: "s18", player1: "Aaron Simpson", player2: "Melvin Ward", winner: 1, score: "2-0" },
  { id: "s19", player1: "Neil Williams", player2: "Craig Guest" },
];

// Round 1 draw was reshuffled (same 24 players, re-randomized opponents) —
// ids keep their original draw position for history; order below is the
// current published draw.
export const tournamentDoublesRound1: TournamentDoublesTie[] = [
  { id: "d11", pair1: ["Wayne Bloxham", "Shaun Bennet"], pair2: ["Craig Guest", "Neil Williams"], winner: 1, score: "2-0" },
  { id: "d2", pair1: ["Jack Towell", "Neil Roberton"], pair2: ["Nigel Halmshaw", "Rob Stimpson"] },
  { id: "d6a", pair1: ["Ollie Webb", "Will Howe"], pair2: ["Sam Blackwell", "Freddy Williamson"], winner: 1, score: "2-1" },
  { id: "d1", pair1: ["Andy Dougie Robb", "Wayne Clarke"], pair2: ["Rhys Hughes", "Dave Wildman"], winner: 2, score: "2-1" },
  { id: "d8a", pair1: ["Graeme Douglas", "Nigel Rose"], pair2: ["Scott Mulheron", "Ollie Mulheron"], winner: 1, score: "2-1" },
  { id: "d4a", pair1: ["Ian Saddington", "Melvin Ward"], pair2: ["Ryan Sheehan", "Dil"], winner: 1 },
  { id: "d12a", pair1: ["Stuart Saddington", "Craig Ward"], pair2: ["Ryan Davies", "Jimmy Howe"], winner: 1 },
  { id: "d5a", pair1: ["Mel Guest", "Steve B"], pair2: ["Leanne Robbins", "Graham Dexter"], winner: 1, score: "2-1" },
  { id: "d6b", pair1: ["Mark Roberts", "Mo Bateman"], pair2: ["Lewis Fitches", "Aaron Simpson"], winner: 1, score: "2-0" },
  { id: "d7a", pair1: ["Andy Saddington", "Rob Barker"], pair2: ["Jamie Saddington", "Carl Simpson"], winner: 1, score: "2-0" },
  { id: "d3a", pair1: ["Remi Sadio", "John Robertson"], pair2: ["Paul Saddington", "Ade Naylor"], winner: 2, score: "2-1" },
  { id: "d7b", pair1: ["Paul Dear", "Cam Saddington"], pair2: ["Mikie Hone", "Sam Mcall"], winner: 2, score: "2-1" },
];
