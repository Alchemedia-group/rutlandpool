"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { extractScoresheetNames } from "@/lib/scoresheet";

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
  revalidatePath("/standings");
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
  revalidatePath("/standings");
}

export async function deleteFixture(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("fixtures").delete().eq("id", id);
  revalidatePath("/admin/fixtures");
  revalidatePath("/fixtures");
  revalidatePath("/results");
  revalidatePath("/standings");
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

// ── Players ─────────────────────────────────────────────────────────────

export async function createPlayer(formData: FormData) {
  const team_id = String(formData.get("team_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const is_captain = formData.get("is_captain") === "on";
  if (!team_id || !name) return;

  const supabase = await createClient();
  await supabase.from("players").insert({ team_id, name, is_captain });
  revalidatePath(`/admin/teams/${team_id}`);
  revalidatePath("/teams");
  revalidatePath("/stats");
}

export async function deletePlayer(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const team_id = String(formData.get("team_id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("players").delete().eq("id", id);
  revalidatePath(`/admin/teams/${team_id}`);
  revalidatePath("/teams");
  revalidatePath("/stats");
}

// ── Frames ──────────────────────────────────────────────────────────────

export async function saveFrame(formData: FormData) {
  const fixture_id = String(formData.get("fixture_id") ?? "");
  const frame_number = Number(formData.get("frame_number"));
  const frame_type = String(formData.get("frame_type") ?? "");
  const winner = String(formData.get("winner") ?? "") || null;
  const break_win = formData.get("break_win") === "on";
  const home_players = [formData.get("home_player_1"), formData.get("home_player_2")]
    .map((v) => String(v ?? ""))
    .filter(Boolean);
  const away_players = [formData.get("away_player_1"), formData.get("away_player_2")]
    .map((v) => String(v ?? ""))
    .filter(Boolean);

  if (!fixture_id || !frame_number || !frame_type || home_players.length === 0 || away_players.length === 0) {
    return;
  }

  const supabase = await createClient();
  await supabase
    .from("frames")
    .upsert(
      { fixture_id, frame_number, frame_type, home_players, away_players, winner, break_win },
      { onConflict: "fixture_id,frame_number" }
    );
  revalidatePath(`/admin/fixtures/${fixture_id}`);
  revalidatePath("/stats");
  revalidatePath("/teams");
}

export async function deleteFrame(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const fixture_id = String(formData.get("fixture_id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("frames").delete().eq("id", id);
  revalidatePath(`/admin/fixtures/${fixture_id}`);
  revalidatePath("/stats");
  revalidatePath("/teams");
}

// ── Scoresheets ─────────────────────────────────────────────────────────

/**
 * Runs OCR on a photo already uploaded straight from the browser to
 * Supabase Storage (see ScoresheetUploadForm) and stores the result. The
 * photo itself never passes through this Server Action's request body —
 * a phone photo easily exceeds the platform's ~4.5MB function body limit,
 * which silently failed the upload when it went through here directly.
 * Only the storage path (a short string) is passed in.
 */
export async function processScoresheet(fixture_id: string, path: string) {
  if (!fixture_id || !path) throw new Error("Missing fixture or photo.");

  const supabase = await createClient();

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("scoresheets")
    .download(path);
  if (downloadError || !fileData) {
    throw new Error(downloadError?.message ?? "Could not read the uploaded photo.");
  }
  const buffer = Buffer.from(await fileData.arrayBuffer());

  const {
    data: { publicUrl },
  } = supabase.storage.from("scoresheets").getPublicUrl(path);

  let suggestions = null;
  try {
    // Raw recognized names, not matched to any roster — the review screen
    // matches them against the live squad itself, so a name that isn't in
    // the system yet still surfaces with a one-click "add to squad".
    suggestions = await extractScoresheetNames(buffer);
  } catch {
    suggestions = null;
  }

  const { error: updateError } = await supabase
    .from("fixtures")
    .update({ scoresheet_url: publicUrl, scoresheet_suggestions: suggestions })
    .eq("id", fixture_id);
  if (updateError) throw new Error(updateError.message);

  revalidatePath(`/admin/fixtures/${fixture_id}`);
}

export async function clearScoresheet(formData: FormData) {
  const fixture_id = String(formData.get("fixture_id") ?? "");
  if (!fixture_id) return;
  const supabase = await createClient();
  await supabase
    .from("fixtures")
    .update({ scoresheet_url: null, scoresheet_suggestions: null })
    .eq("id", fixture_id);
  revalidatePath(`/admin/fixtures/${fixture_id}`);
}

export async function addSuggestedPlayer(formData: FormData) {
  const side = String(formData.get("new_player_side") ?? "") === "away" ? "away" : "home";
  const fixture_id = String(formData.get("fixture_id") ?? "");
  const team_id = String(formData.get(`${side}_team_id`) ?? "");
  const name = String(formData.get(`${side}_suggested_name`) ?? "").trim();
  if (!team_id || !name) return;

  const supabase = await createClient();
  await supabase.from("players").insert({ team_id, name, is_captain: false });
  revalidatePath(`/admin/teams/${team_id}`);
  revalidatePath("/teams");
  revalidatePath("/stats");
  if (fixture_id) revalidatePath(`/admin/fixtures/${fixture_id}`);
}
