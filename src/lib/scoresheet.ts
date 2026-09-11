import { createWorker } from "tesseract.js";
import { bestMatchWithScore } from "@/lib/fuzzyMatch";
import type { Player } from "@/lib/types";

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

export type ScoresheetSuggestions = {
  home: (string | null)[];
  away: (string | null)[];
};

const FRAME_COUNT = 9;
const MATCH_THRESHOLD = 0.55;

/**
 * Best-effort, free-OCR name guesses for the 9 frame rows — never winners
 * or scores, since reading a handwritten tick/circle reliably needs real
 * vision understanding, not text OCR. Splits recognized words into a left
 * (home) and right (away) half by x-position, regroups them into rows, then
 * keeps only rows that closely match an actual roster name (filtering out
 * titles/dates/headers on the form), in top-to-bottom order.
 */
export async function extractScoresheetSuggestions(
  buffer: Buffer,
  homePlayers: Player[],
  awayPlayers: Player[]
): Promise<ScoresheetSuggestions | null> {
  if (homePlayers.length === 0 && awayPlayers.length === 0) return null;

  const words = await recognizeWords(buffer);
  if (words.length === 0) return null;

  const midX = Math.max(...words.map((w) => w.x1)) / 2;
  const leftRows = clusterIntoRows(words.filter((w) => (w.x0 + w.x1) / 2 < midX));
  const rightRows = clusterIntoRows(words.filter((w) => (w.x0 + w.x1) / 2 >= midX));

  const matchedIds = (rows: { text: string }[], roster: Player[]) =>
    rows
      .map((row) => bestMatchWithScore(row.text, roster, (p) => p.name, MATCH_THRESHOLD)?.item.id ?? null)
      .filter((id): id is string => id !== null);

  const homeIds = matchedIds(leftRows, homePlayers);
  const awayIds = matchedIds(rightRows, awayPlayers);

  return {
    home: Array.from({ length: FRAME_COUNT }, (_, i) => homeIds[i] ?? null),
    away: Array.from({ length: FRAME_COUNT }, (_, i) => awayIds[i] ?? null),
  };
}
