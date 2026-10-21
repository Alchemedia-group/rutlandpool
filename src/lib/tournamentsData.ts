// Singles & Doubles knockout, run alongside the league (AGM 2026 — "Doubles
// and Singles Buy-In Tournaments", src/lib/agmData.ts). Opponents arrange
// their own match within the round's deadline; results here are separate
// from league points, standings and stats.

export type TournamentSinglesTie = {
  id: string;
  player1: string;
  player2: string;
};

export type TournamentDoublesTie = {
  id: string;
  pair1: [string, string];
  pair2: [string, string];
};

export const tournamentRound1Deadline = "2026-11-04"; // Wed 4 Nov

export const tournamentEntryFees = { singles: 3, doubles: 5 };

export const tournamentSinglesRound1: TournamentSinglesTie[] = [
  { id: "s1", player1: "Will Howe", player2: "Jack Towell" },
  { id: "s2", player1: "Leanne Robbins", player2: "Steve Brawn" },
  { id: "s3", player1: "Stuart Saddington", player2: "Andy Saddington" },
  { id: "s4", player1: "Freddy Williamson", player2: "Mel Guest" },
  { id: "s5", player1: "Lawrence Allison", player2: "Mo Bateman" },
  { id: "s6", player1: "Kevin Southwell", player2: "John Robertson" },
  { id: "s7", player1: "Rhys Hughes", player2: "Shaun Bennet" },
  { id: "s8", player1: "Lewis Fitches", player2: "Ian Saddington" },
  { id: "s9", player1: "Kelly Easton", player2: "Ollie Webb" },
  { id: "s10", player1: "Carl Simpson", player2: "Sam Blackwell" },
  { id: "s11", player1: "Brennan Kirby", player2: "Jamie Saddington" },
  { id: "s12", player1: "Rob Barker", player2: "Cam Saddington" },
  { id: "s13", player1: "Graeme Douglas", player2: "Paul Dear" },
  { id: "s14", player1: "Wayne Clarke", player2: "Mark Roberts" },
  { id: "s15", player1: "Scott Webb", player2: "Mikie Hone" },
  { id: "s16", player1: "Sam Mcall", player2: "Remi Sadio" },
  { id: "s17", player1: "Andy Dougie Robb", player2: "Wayne Bloxham" },
  { id: "s18", player1: "Aaron Simpson", player2: "Melvin Ward" },
  { id: "s19", player1: "Neil Williams", player2: "Craig Guest" },
];

export const tournamentDoublesRound1: TournamentDoublesTie[] = [
  { id: "d1", pair1: ["Andy Dougie Robb", "Wayne Clarke"], pair2: ["Rhys Hughes", "Dave Wildman"] },
  { id: "d2", pair1: ["Jack Towell", "Neil Roberton"], pair2: ["Sam Blackwell", "Freddy Williamson"] },
  { id: "d3", pair1: ["Lewis Fitches", "Aaron Simpson"], pair2: ["Remi Sadio", "John Robertson"] },
  { id: "d4", pair1: ["Ian Saddington", "Melvin Ward"], pair2: ["Paul Saddington", "Ade Naylor"] },
  { id: "d5", pair1: ["Mikie Hone", "Sam Mcall"], pair2: ["Mel Guest", "Steve B"] },
  { id: "d6", pair1: ["Ollie Webb", "Will Howe"], pair2: ["Mark Roberts", "Mo Bateman"] },
  { id: "d7", pair1: ["Paul Dear", "Cam Saddington"], pair2: ["Andy Saddington", "Rob Barker"] },
  { id: "d8", pair1: ["Graeme Douglas", "Nigel Rose"], pair2: ["Nigel Halmshaw", "Rob Stimpson"] },
  { id: "d9", pair1: ["Leanne Robbins", "Graham Dexter"], pair2: ["Ryan Davies", "Jimmy Howe"] },
  { id: "d10", pair1: ["Ryan Sheehan", "Dil"], pair2: ["Scott Mulheron", "Ollie Mulheron"] },
  { id: "d11", pair1: ["Wayne Bloxham", "Shaun Bennet"], pair2: ["Craig Guest", "Neil Williams"] },
];
