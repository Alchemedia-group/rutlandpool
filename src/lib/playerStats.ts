import type { Frame } from "@/lib/types";

export type PlayerRecordRow = {
  player_id: string;
  played: number;
  won: number;
  lost: number;
  winPct: number;
};

const MIN_FRAMES_TO_QUALIFY = 4;

function frameMatches(frame: Frame, mode: "singles" | "doubles") {
  const sideSize = frame.home_players.length;
  if (mode === "singles") {
    return frame.frame_type === "singles" || (frame.frame_type === "decider" && sideSize === 1);
  }
  return frame.frame_type === "doubles" || (frame.frame_type === "decider" && sideSize === 2);
}

/**
 * Singles/doubles leaderboards: every player on the winning side of a frame
 * gets a win, every player on the losing side gets a loss. A "decider" frame
 * is folded into whichever tab matches its player count, since RCPL hasn't
 * fixed its format yet (singles or doubles).
 */
export function computePlayerRecords(
  frames: Frame[],
  mode: "singles" | "doubles"
): PlayerRecordRow[] {
  const rows = new Map<string, PlayerRecordRow>();

  const bump = (playerId: string, won: boolean) => {
    const row = rows.get(playerId) ?? { player_id: playerId, played: 0, won: 0, lost: 0, winPct: 0 };
    row.played += 1;
    if (won) row.won += 1;
    else row.lost += 1;
    rows.set(playerId, row);
  };

  for (const frame of frames) {
    if (!frameMatches(frame, mode) || !frame.winner) continue;
    const winners = frame.winner === "home" ? frame.home_players : frame.away_players;
    const losers = frame.winner === "home" ? frame.away_players : frame.home_players;
    for (const pid of winners) bump(pid, true);
    for (const pid of losers) bump(pid, false);
  }

  return Array.from(rows.values())
    .map((row) => ({ ...row, winPct: row.played ? (row.won / row.played) * 100 : 0 }))
    .filter((row) => row.played >= MIN_FRAMES_TO_QUALIFY)
    .sort((a, b) => b.winPct - a.winPct || b.played - a.played);
}

/** Combined record across every frame type — used on a team's squad page. */
export function computeCombinedPlayerRecords(frames: Frame[]): PlayerRecordRow[] {
  const rows = new Map<string, PlayerRecordRow>();

  const bump = (playerId: string, won: boolean) => {
    const row = rows.get(playerId) ?? { player_id: playerId, played: 0, won: 0, lost: 0, winPct: 0 };
    row.played += 1;
    if (won) row.won += 1;
    else row.lost += 1;
    rows.set(playerId, row);
  };

  for (const frame of frames) {
    if (!frame.winner) continue;
    const winners = frame.winner === "home" ? frame.home_players : frame.away_players;
    const losers = frame.winner === "home" ? frame.away_players : frame.home_players;
    for (const pid of winners) bump(pid, true);
    for (const pid of losers) bump(pid, false);
  }

  return Array.from(rows.values())
    .map((row) => ({ ...row, winPct: row.played ? (row.won / row.played) * 100 : 0 }))
    .sort((a, b) => b.played - a.played);
}

export type BreakRow = { player_id: string; breakWins: number };

/** Break wins: credited to every player on the winning side of a break-win frame. */
export function computeBreakWins(frames: Frame[]): BreakRow[] {
  const rows = new Map<string, number>();
  for (const frame of frames) {
    if (!frame.break_win || !frame.winner) continue;
    const winners = frame.winner === "home" ? frame.home_players : frame.away_players;
    for (const pid of winners) rows.set(pid, (rows.get(pid) ?? 0) + 1);
  }
  return Array.from(rows.entries())
    .map(([player_id, breakWins]) => ({ player_id, breakWins }))
    .sort((a, b) => b.breakWins - a.breakWins);
}
