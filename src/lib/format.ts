/** e.g. "2026-10-07" -> "Wed 7 Oct". */
export function formatWeekDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
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
