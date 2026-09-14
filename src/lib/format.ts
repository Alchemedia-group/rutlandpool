/** UK local time — matches are always quoted at real UK clock time (8pm),
 * so conversions must go through this rather than the server's own
 * timezone (UTC on Vercel), which would show the wrong hour half the
 * season since the BST/GMT offset from a stored UTC timestamp changes. */
export const LEAGUE_TIME_ZONE = "Europe/London";

/** e.g. "2026-10-07" -> "Wed 7 Oct". */
export function formatWeekDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: LEAGUE_TIME_ZONE,
  });
}

/** e.g. "Wed, 7 Oct, 20:00" (or with the year, for admin views). */
export function formatKickoff(iso: string, opts: { withYear?: boolean } = {}): string {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(opts.withYear ? { year: "numeric" as const } : {}),
    hour: "2-digit",
    minute: "2-digit",
    timeZone: LEAGUE_TIME_ZONE,
  });
}

/** A fixture's venue is its own override if set, otherwise the home team's
 * registered venue — matches are played at the home side's pub/club. */
export function fixtureVenue(fixture: { venue: string | null; home_team: { venue: string | null } }): string | null {
  return fixture.venue ?? fixture.home_team.venue ?? null;
}

/** Short badge code for a team, e.g. "UTFC 2" -> "U2", "Duke A" -> "DA". */
export function teamBadgeCode(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1];
  if (/^\d+$/.test(last)) return (parts[0][0] + last).toUpperCase();
  return (parts[0][0] + last[0]).toUpperCase();
}

/** Abbreviates a full name's first word to an initial, e.g. "Terry Naylor" -> "T. Naylor". */
export function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function ordinalPosition(n: number): string {
  return ordinal(n);
}
