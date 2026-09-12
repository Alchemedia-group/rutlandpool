import {
  agmClosing,
  agmCommitteeNote,
  agmIntro,
  agmPs,
  agmSections,
} from "@/lib/agmData";

export default function Agm2026Page() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">AGM 2026</h1>
      <p className="mb-8 text-ink/50">Minutes — 2026/27 season</p>

      <div className="space-y-3 text-sm leading-relaxed text-ink/80">
        {agmIntro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {agmSections.map((section, si) => (
          <section key={si}>
            {section.heading && (
              <h2 className="mb-2 font-display text-lg font-bold">{section.heading}</h2>
            )}
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 rounded-lg border-l-4 border-gold bg-cream-card px-4 py-3 text-sm leading-relaxed text-ink/80">
        {agmCommitteeNote}
      </p>

      <div className="mt-8 space-y-1 text-sm text-ink/80">
        {agmClosing.map((p, i) => (
          <p key={i} className={i === agmClosing.length - 1 ? "font-display font-bold" : ""}>
            {p}
          </p>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink/40">{agmPs}</p>
    </div>
  );
}
