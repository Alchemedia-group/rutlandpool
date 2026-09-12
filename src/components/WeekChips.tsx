"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatWeekDate } from "@/lib/format";

export function WeekChips({
  dateKeys,
  selectedDateKey,
}: {
  dateKeys: string[];
  selectedDateKey: string;
}) {
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedDateKey]);

  return (
    <div className="-mt-6 flex gap-2 overflow-x-auto pb-2">
      {dateKeys.map((d) => {
        const active = d === selectedDateKey;
        return (
          <Link
            key={d}
            ref={active ? activeRef : undefined}
            href={`/?week=${d}`}
            className={`shrink-0 rounded border px-3 py-1 text-sm transition ${
              active
                ? "border-felt-dark bg-felt-dark text-white"
                : "border-ink/15 text-ink/60 hover:border-felt-dark hover:text-felt-dark"
            }`}
          >
            {formatWeekDate(d)}
          </Link>
        );
      })}
    </div>
  );
}
