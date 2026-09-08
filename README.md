# Rutland County Pool League

Public website for the Rutland County Pool League — teams, fixtures, results,
league table, and news, with a simple admin area for the committee to manage
all of it. Built with Next.js (App Router) and Supabase.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions) — one app for the
  public site and the admin area.
- **Tailwind CSS** for styling.
- **Supabase** (Postgres + Auth) — data storage and committee login. Public
  pages read data anonymously; admin pages require a Supabase Auth user that's
  listed in the `admins` table.

There's no self-serve signup: admin accounts are created directly in Supabase
and then granted access via the `admins` table (see below). This matches what
was asked for — a small committee manages content, the public just reads it.

## Data model

- `seasons` — one row per season; exactly one can be `is_current`.
- `teams` — name, slug (used in `/teams/<slug>` URLs), venue.
- `fixtures` — home/away team, scheduled time, venue, status
  (`scheduled`/`played`/`postponed`/`cancelled`), and `home_frames`/`away_frames`
  once played. The league table is computed from these on every page load
  (no separate standings table to keep in sync) — see `src/lib/standings.ts`.
  Scoring: 2 points for a win, 1 each for a draw, ties broken by frame
  difference then frames for.
- `news_posts` — title/slug/body, `published` flag so drafts can be prepared
  ahead of time.
- `admins` — Supabase Auth user ids allowed to write data; enforced by
  Postgres row-level security (`supabase/migrations/0001_init.sql`), not just
  in the app.

## Local setup

1. Create a [Supabase](https://supabase.com) project.
2. Run `supabase/migrations/0001_init.sql` against it (Supabase Studio → SQL
   Editor, or `supabase db push` with the CLI).
3. Copy `.env.example` to `.env.local` and fill in your project URL and anon
   key (Supabase project settings → API).
4. Install and run:

   ```
   npm install
   npm run dev
   ```

5. Create your first season and add teams from `/admin` — but first you need
   an admin account:
   - In Supabase Studio → Authentication, create a user with your email and a
     password.
   - In the SQL editor, run:
     ```sql
     insert into admins (user_id)
     select id from auth.users where email = 'you@example.com';
     ```
   - Sign in at `/admin/login`.

## Deploying

Any Next.js host works (Vercel is the path of least resistance). Set the same
two `NEXT_PUBLIC_SUPABASE_*` environment variables there. No other
infrastructure is required — Supabase is the only backend.

## Repo layout

```
app/                   Routes (public pages + /admin)
  admin/actions.ts      Server Actions for all admin writes (teams, fixtures,
                         results, news, seasons, login/logout)
src/lib/supabase/       Browser + server Supabase clients, auth session refresh
src/lib/data.ts          Public data-fetching helpers (RSC)
src/lib/standings.ts     League table computation from fixture results
src/lib/types.ts         Shared row types
src/components/         Header, Footer, FixtureList, StandingsTable
supabase/migrations/     SQL schema + RLS policies
proxy.ts                 Redirects unauthenticated visitors away from /admin
```

## Not built yet

- Contact page has a placeholder — add the committee's real contact details
  before launch (`app/contact/page.tsx`).
- Player rosters / individual stats (only team-level results right now).
- Editing an existing team/fixture/news post (currently: delete and re-add).
- Email notifications, RSS, or any of the heavier LeagueRepublic-style
  features — this is deliberately a lean MVP.
