-- Rutland County Pool League — initial schema
-- Run this against a fresh Supabase project (SQL Editor or `supabase db push`).

create extension if not exists "pgcrypto";

-- ── Admins ──────────────────────────────────────────────────────────────
-- Membership in this table (by auth.users id) is what makes someone an
-- admin. There is no self-serve signup for admin accounts: create the
-- Supabase Auth user first (Studio → Authentication, or via a magic link),
-- then insert their id here.
create table admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create function is_admin() returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ── Seasons ─────────────────────────────────────────────────────────────
create table seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

-- Only one current season at a time.
create unique index seasons_one_current on seasons (is_current) where is_current;

-- ── Teams ───────────────────────────────────────────────────────────────
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  venue text,
  logo_url text,
  created_at timestamptz not null default now()
);

-- ── Fixtures (also carries the result, once played) ────────────────────
create table fixtures (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references seasons(id) on delete cascade,
  home_team_id uuid not null references teams(id) on delete restrict,
  away_team_id uuid not null references teams(id) on delete restrict,
  scheduled_at timestamptz not null,
  venue text,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'played', 'postponed', 'cancelled')),
  home_frames int,
  away_frames int,
  notes text,
  created_at timestamptz not null default now(),
  constraint fixtures_distinct_teams check (home_team_id <> away_team_id),
  constraint fixtures_scores_present_when_played check (
    status <> 'played' or (home_frames is not null and away_frames is not null)
  )
);

create index fixtures_season_idx on fixtures (season_id, scheduled_at);

-- ── News ────────────────────────────────────────────────────────────────
create table news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index news_posts_published_idx on news_posts (published, published_at desc);

-- ── Row-level security ──────────────────────────────────────────────────
alter table admins enable row level security;
alter table seasons enable row level security;
alter table teams enable row level security;
alter table fixtures enable row level security;
alter table news_posts enable row level security;

-- admins: no public access at all; only readable by admins themselves via
-- is_admin(), which runs as security definer, so no policy is needed here.

create policy "seasons are publicly readable" on seasons
  for select using (true);
create policy "admins manage seasons" on seasons
  for all using (is_admin()) with check (is_admin());

create policy "teams are publicly readable" on teams
  for select using (true);
create policy "admins manage teams" on teams
  for all using (is_admin()) with check (is_admin());

create policy "fixtures are publicly readable" on fixtures
  for select using (true);
create policy "admins manage fixtures" on fixtures
  for all using (is_admin()) with check (is_admin());

create policy "published news is publicly readable" on news_posts
  for select using (published or is_admin());
create policy "admins manage news" on news_posts
  for all using (is_admin()) with check (is_admin());
