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

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  published: boolean;
  published_at: string;
  created_at: string;
};
