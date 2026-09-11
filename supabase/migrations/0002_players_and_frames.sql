-- Players (squad rosters) and frame-by-frame results.
-- Team-level match aggregate (fixtures.home_frames/away_frames) is still the
-- source of truth for the league table; frames are additive detail that
-- unlocks player stats (singles/doubles/breaks leaderboards) and squad pages
-- once captains start entering them — a match can have a result without any
-- frames rows yet.

create table players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  name text not null,
  is_captain boolean not null default false,
  created_at timestamptz not null default now()
);

create index players_team_idx on players (team_id);

create table frames (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references fixtures(id) on delete cascade,
  frame_number int not null check (frame_number between 1 and 9),
  frame_type text not null check (frame_type in ('singles', 'doubles', 'decider')),
  home_players uuid[] not null,
  away_players uuid[] not null,
  winner text check (winner in ('home', 'away')),
  break_win boolean not null default false,
  created_at timestamptz not null default now(),
  unique (fixture_id, frame_number)
);

create index frames_fixture_idx on frames (fixture_id);

alter table players enable row level security;
alter table frames enable row level security;

create policy "players are publicly readable" on players
  for select using (true);
create policy "admins manage players" on players
  for all using (is_admin()) with check (is_admin());

create policy "frames are publicly readable" on frames
  for select using (true);
create policy "admins manage frames" on frames
  for all using (is_admin()) with check (is_admin());
