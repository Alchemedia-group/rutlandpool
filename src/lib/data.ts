import { createClient } from "@/lib/supabase/server";
import type { Fixture, FixtureWithTeams, NewsPost, Season, Team } from "@/lib/types";

export async function getCurrentSeason(): Promise<Season | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_current", true)
    .maybeSingle();
  return data;
}

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("teams").select("*").order("name");
  return data ?? [];
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function getFixtures(seasonId?: string): Promise<FixtureWithTeams[]> {
  const supabase = await createClient();
  let query = supabase
    .from("fixtures")
    .select("*, home_team:home_team_id(*), away_team:away_team_id(*)")
    .order("scheduled_at", { ascending: true });
  if (seasonId) query = query.eq("season_id", seasonId);
  const { data } = await query;
  return (data as unknown as FixtureWithTeams[]) ?? [];
}

export async function getFixturesForTeam(teamId: string): Promise<FixtureWithTeams[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("fixtures")
    .select("*, home_team:home_team_id(*), away_team:away_team_id(*)")
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .order("scheduled_at", { ascending: true });
  return (data as unknown as FixtureWithTeams[]) ?? [];
}

export async function getRawFixtures(seasonId?: string): Promise<Fixture[]> {
  const supabase = await createClient();
  let query = supabase.from("fixtures").select("*");
  if (seasonId) query = query.eq("season_id", seasonId);
  const { data } = await query;
  return data ?? [];
}

export async function getPublishedNews(): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
}
