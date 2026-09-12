"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FRAME_COUNT, frameTypeForNumber } from "@/lib/frames";

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

/** Finds a player by name on a team (case-insensitive), or creates one on
 * the fly — covers a stand-in playing for someone who couldn't make it,
 * without needing to be added to the squad ahead of time. `known` is
 * mutated so a stand-in named in more than one frame this same submission
 * resolves to the same player instead of being created twice. */
async function resolvePlayerId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  team_id: string,
  rawName: string,
  known: { id: string; name: string }[]
): Promise<string | null> {
  const name = rawName.trim();
  if (!name) return null;

  const existing = known.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("players")
    .insert({ team_id, name, is_captain: false })
    .select("id, name")
    .single();
  if (error || !created) return null;

  known.push(created);
  return created.id;
}

/**
 * Saves every frame of a match in one go. Player fields are free text, not
 * a fixed dropdown — a stand-in name that isn't already on the squad is
 * added automatically rather than rejected, since it's normal for someone
 * to fill in for a player who couldn't make it.
 */
export async function saveMatch(formData: FormData) {
  const fixture_id = String(formData.get("fixture_id") ?? "");
  const home_team_id = String(formData.get("home_team_id") ?? "");
  const away_team_id = String(formData.get("away_team_id") ?? "");
  if (!fixture_id || !home_team_id || !away_team_id) return;

  const supabase = await createClient();
  const [{ data: homeKnown }, { data: awayKnown }, { data: existingFrames }] = await Promise.all([
    supabase.from("players").select("id, name").eq("team_id", home_team_id),
    supabase.from("players").select("id, name").eq("team_id", away_team_id),
    supabase.from("frames").select("frame_number, break_win").eq("fixture_id", fixture_id),
  ]);
  const homePlayers = homeKnown ?? [];
  const awayPlayers = awayKnown ?? [];
  // The compact entry table dropped the break-win checkbox — carry each
  // frame's previously recorded value forward instead of resetting it.
  const breakWinByFrame = new Map((existingFrames ?? []).map((f) => [f.frame_number, f.break_win]));

  let homeFramesWon = 0;
  let awayFramesWon = 0;

  for (let frameNumber = 1; frameNumber <= FRAME_COUNT; frameNumber++) {
    const frame_type = frameTypeForNumber(frameNumber);
    const winner = String(formData.get(`frame_${frameNumber}_winner`) ?? "") || null;
    const break_win = breakWinByFrame.get(frameNumber) ?? false;

    const homeNames = [
      formData.get(`frame_${frameNumber}_home_1`),
      formData.get(`frame_${frameNumber}_home_2`),
    ].map((v) => String(v ?? ""));
    const awayNames = [
      formData.get(`frame_${frameNumber}_away_1`),
      formData.get(`frame_${frameNumber}_away_2`),
    ].map((v) => String(v ?? ""));

    const home_players = (
      await Promise.all(homeNames.map((n) => resolvePlayerId(supabase, home_team_id, n, homePlayers)))
    ).filter((id): id is string => id !== null);
    const away_players = (
      await Promise.all(awayNames.map((n) => resolvePlayerId(supabase, away_team_id, n, awayPlayers)))
    ).filter((id): id is string => id !== null);

    if (home_players.length === 0 || away_players.length === 0) continue;

    await supabase
      .from("frames")
      .upsert(
        { fixture_id, frame_number: frameNumber, frame_type, home_players, away_players, winner, break_win },
        { onConflict: "fixture_id,frame_number" }
      );

    if (winner === "home") homeFramesWon++;
    if (winner === "away") awayFramesWon++;
  }

  if (homeFramesWon + awayFramesWon > 0) {
    await supabase
      .from("fixtures")
      .update({ status: "played", home_frames: homeFramesWon, away_frames: awayFramesWon })
      .eq("id", fixture_id);
  }

  revalidatePath(`/admin/fixtures/${fixture_id}`);
  revalidatePath("/admin/fixtures");
  revalidatePath("/admin/teams");
  revalidatePath("/fixtures");
  revalidatePath("/results");
  revalidatePath("/standings");
  revalidatePath("/stats");
  revalidatePath("/teams");
}

// ── Contact messages ─────────────────────────────────────────────────────

export async function deleteContactMessage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/contact");
}
