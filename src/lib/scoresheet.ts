import { createWorker } from "tesseract.js";

type WordBox = { text: string; x0: number; y0: number; x1: number; y1: number };

async function recognizeWords(buffer: Buffer): Promise<WordBox[]> {
  // cachePath must be a writable dir — the project directory is read-only
  // on Vercel's serverless functions, but /tmp always is.
  const worker = await createWorker("eng", 1, { cachePath: "/tmp", logger: () => {} });
  try {
    const { data } = await worker.recognize(buffer);
    return data.words
      .map((w) => ({ text: w.text.trim(), x0: w.bbox.x0, y0: w.bbox.y0, x1: w.bbox.x1, y1: w.bbox.y1 }))
      .filter((w) => w.text.length > 0);
  } finally {
    await worker.terminate();
  }
}

/** Groups words into text rows by y-position — tesseract's own line grouping
 * spans the full page width, which merges a scoresheet's home/away columns
 * into one line, so rows are rebuilt here after the column split instead. */
function clusterIntoRows(words: WordBox[]): { y: number; text: string }[] {
  const rows: { y: number; words: WordBox[] }[] = [];
  const ROW_TOLERANCE = 18;

  for (const word of [...words].sort((a, b) => a.y0 - b.y0)) {
    const row = rows.find((r) => Math.abs(r.y - word.y0) <= ROW_TOLERANCE);
    if (row) {
      row.words.push(word);
      row.y = (row.y * (row.words.length - 1) + word.y0) / row.words.length;
    } else {
      rows.push({ y: word.y0, words: [word] });
    }
  }

  return rows
    .sort((a, b) => a.y - b.y)
    .map((r) => ({
      y: r.y,
      text: r.words
        .sort((a, b) => a.x0 - b.x0)
        .map((w) => w.text)
        .join(" "),
    }));
}

const NON_NAME_WORDS = new Set([
  "team",
  "teams",
  "player",
  "players",
  "score",
  "scores",
  "result",
  "results",
  "form",
  "match",
  "matches",
  "date",
  "venue",
  "vs",
  "frame",
  "frames",
  "home",
  "away",
  "singles",
  "doubles",
  "decider",
  "captain",
  "signed",
  "signature",
  "knockout",
  "semi",
  "final",
  "league",
  "division",
  "week",
  "season",
]);

/** A cheap "does this look like a handwritten person's name" filter — not
 * roster-aware, since the whole point is to also surface names that aren't
 * in the system yet. Rejects obvious form furniture (titles, dates, scores)
 * without knowing anything about who's actually playing. */
function looksLikeName(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 3 || trimmed.length > 30) return false;
  if (/\d/.test(trimmed)) return false;
  if (!/^[A-Za-z][A-Za-z.'-]*(\s+[A-Za-z][A-Za-z.'-]*){0,3}$/.test(trimmed)) return false;

  const words = trimmed.toLowerCase().split(/\s+/);
  if (words.some((w) => NON_NAME_WORDS.has(w))) return false;

  return true;
}

export type ScoresheetSuggestions = {
  home: (string | null)[];
  away: (string | null)[];
};

const FRAME_COUNT = 9;

/**
 * Best-effort, free-OCR name guesses for the 9 frame rows — raw recognized
 * text, not matched to any roster, so a name that isn't in the system yet
 * still comes through and can be added to the squad from the review screen.
 * Winners/scores are never guessed here: reading a handwritten tick/circle
 * reliably needs real vision understanding, not text OCR, so those stay
 * manual. Splits recognized words into a left (home) and right (away) half
 * by x-position, regroups them into rows, then keeps only rows that look
 * like a plausible person's name (filtering out titles/dates/headers), in
 * top-to-bottom order.
 */
export async function extractScoresheetNames(buffer: Buffer): Promise<ScoresheetSuggestions | null> {
  const words = await recognizeWords(buffer);
  if (words.length === 0) return null;

  const midX = Math.max(...words.map((w) => w.x1)) / 2;
  const leftRows = clusterIntoRows(words.filter((w) => (w.x0 + w.x1) / 2 < midX));
  const rightRows = clusterIntoRows(words.filter((w) => (w.x0 + w.x1) / 2 >= midX));

  const names = (rows: { text: string }[]) =>
    rows.map((r) => r.text.trim()).filter(looksLikeName);

  const homeNames = names(leftRows);
  const awayNames = names(rightRows);

  return {
    home: Array.from({ length: FRAME_COUNT }, (_, i) => homeNames[i] ?? null),
    away: Array.from({ length: FRAME_COUNT }, (_, i) => awayNames[i] ?? null),
  };
}
