"use client";

import { useState } from "react";
import type { TournamentDoublesTie, TournamentSinglesTie } from "@/lib/tournamentsData";

export function TournamentBracket({
  singles,
  doubles,
}: {
  singles: TournamentSinglesTie[];
  doubles: TournamentDoublesTie[];
}) {
  const [tab, setTab] = useState<"singles" | "doubles">("singles");

  return (
    <div>
      <div className="flex gap-2" role="tablist" aria-label="Tournament">
        <TabButton active={tab === "singles"} onClick={() => setTab("singles")}>
          Singles <span className="font-normal opacity-70">· {singles.length}</span>
        </TabButton>
        <TabButton active={tab === "doubles"} onClick={() => setTab("doubles")}>
          Doubles <span className="font-normal opacity-70">· {doubles.length}</span>
        </TabButton>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-b border-ink/10 pb-2">
        <h2 className="font-display text-lg font-bold">
          {tab === "singles" ? "Singles" : "Doubles"} · Round 1
        </h2>
        <span className="text-sm text-ink/50">
          {tab === "singles" ? `${singles.length * 2} players` : `${doubles.length * 2} pairs`}
        </span>
      </div>

      {tab === "singles" ? (
        <ul className="divide-y divide-ink/10">
          {singles.map((tie, i) => (
            <TieRow key={tie.id} num={i + 1} a={tie.player1} b={tie.player2} />
          ))}
        </ul>
      ) : (
        <ul className="divide-y divide-ink/10">
          {doubles.map((tie, i) => (
            <TieRow key={tie.id} num={i + 1} a={tie.pair1.join(" & ")} b={tie.pair2.join(" & ")} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded border px-4 py-1.5 font-display text-sm font-bold transition ${
        active
          ? "border-felt-dark bg-felt-dark text-white"
          : "border-ink/15 text-ink/60 hover:border-felt-dark hover:text-felt-dark"
      }`}
    >
      {children}
    </button>
  );
}

function TieRow({ num, a, b }: { num: number; a: string; b: string }) {
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3">
      <span className="w-5 shrink-0 text-xs font-semibold text-ink/40">{num}</span>
      <span className="min-w-0 flex-1 basis-32 font-medium">{a}</span>
      <span className="shrink-0 font-display text-xs font-bold lowercase text-gold">v</span>
      <span className="min-w-0 flex-1 basis-32 text-right font-medium sm:text-left">{b}</span>
      <span className="ml-auto shrink-0 rounded border border-ink/15 px-3 py-1 font-display text-xs font-bold text-ink/30">
        To play
      </span>
    </li>
  );
}
