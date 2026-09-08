"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Auth ────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ── Seasons ─────────────────────────────────────────────────────────────

export async function createSeason(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const supabase = await createClient();
  await supabase.from("seasons").insert({ name });
  revalidatePath("/admin/seasons");
}

export async function setCurrentSeason(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("seasons").update({ is_current: false }).neq("id", id);
  await supabase.from("seasons").update({ is_current: true }).eq("id", id);
  revalidatePath("/admin/seasons");
  revalidatePath("/");
}

// ── Teams ───────────────────────────────────────────────────────────────

export async function createTeam(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim() || null;
  if (!name) return;

  const supabase = await createClient();
  await supabase.from("teams").insert({ name, slug: slugify(name), venue });
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
}

export async function deleteTeam(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("teams").delete().eq("id", id);
  revalidatePath("/admin/teams");
  revalidatePath("/teams");
}

// ── Fixtures ────────────────────────────────────────────────────────────

export async function createFixture(formData: FormData) {
  const season_id = String(formData.get("season_id") ?? "");
  const home_team_id = String(formData.get("home_team_id") ?? "");
  const away_team_id = String(formData.get("away_team_id") ?? "");
  const scheduled_at = String(formData.get("scheduled_at") ?? "");
  const venue = String(formData.get("venue") ?? "").trim() || null;
  if (!season_id || !home_team_id || !away_team_id || !scheduled_at) return;
  if (home_team_id === away_team_id) return;

  const supabase = await createClient();
  await supabase.from("fixtures").insert({
    season_id,
    home_team_id,
    away_team_id,
    scheduled_at: new Date(scheduled_at).toISOString(),
    venue,
  });
  revalidatePath("/admin/fixtures");
  revalidatePath("/fixtures");
}

export async function recordResult(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const home_frames = Number(formData.get("home_frames"));
  const away_frames = Number(formData.get("away_frames"));
  if (!id || Number.isNaN(home_frames) || Number.isNaN(away_frames)) return;

  const supabase = await createClient();
  await supabase
    .from("fixtures")
    .update({ status: "played", home_frames, away_frames })
    .eq("id", id);
  revalidatePath("/admin/fixtures");
  revalidatePath("/fixtures");
  revalidatePath("/results");
  revalidatePath("/table");
}

export async function setFixtureStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["scheduled", "postponed", "cancelled"].includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("fixtures")
    .update({ status, home_frames: null, away_frames: null })
    .eq("id", id);
  revalidatePath("/admin/fixtures");
  revalidatePath("/fixtures");
  revalidatePath("/results");
  revalidatePath("/table");
}

export async function deleteFixture(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("fixtures").delete().eq("id", id);
  revalidatePath("/admin/fixtures");
  revalidatePath("/fixtures");
  revalidatePath("/results");
  revalidatePath("/table");
}

// ── News ────────────────────────────────────────────────────────────────

export async function createNewsPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const published = formData.get("published") === "on";
  if (!title || !body) return;

  const supabase = await createClient();
  await supabase.from("news_posts").insert({
    title,
    slug: `${slugify(title)}-${Date.now().toString(36)}`,
    body,
    published,
    published_at: new Date().toISOString(),
  });
  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function deleteNewsPost(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("news_posts").delete().eq("id", id);
  revalidatePath("/admin/news");
  revalidatePath("/news");
}
