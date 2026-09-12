export type Season = {
  id: string;
  name: string;
  is_current: boolean;
  created_at: string;
};

export type Team = {
  id: string;
  name: string;
  slug: string;
  venue: string | null;
  logo_url: string | null;
  created_at: string;
};

export type FixtureStatus = "scheduled" | "played" | "postponed" | "cancelled";

export type Fixture = {
  id: string;
  season_id: string;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  venue: string | null;
  status: FixtureStatus;
  home_frames: number | null;
  away_frames: number | null;
  notes: string | null;
  created_at: string;
};

export type FixtureWithTeams = Fixture & {
  home_team: Team;
  away_team: Team;
};

export type Player = {
  id: string;
  team_id: string;
  name: string;
  is_captain: boolean;
  created_at: string;
};

export type FrameType = "singles" | "doubles" | "decider";

export type Frame = {
  id: string;
  fixture_id: string;
  frame_number: number;
  frame_type: FrameType;
  home_players: string[];
  away_players: string[];
  winner: "home" | "away" | null;
  break_win: boolean;
  created_at: string;
};
