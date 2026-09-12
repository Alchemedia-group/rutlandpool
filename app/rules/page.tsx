import Image from "next/image";
import { rulesLastUpdated, rulesSections } from "@/lib/rulesData";

export default function RulesPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">League Rules</h1>
      <p className="mb-8 text-ink/50">2026/27 season · Last updated {rulesLastUpdated}</p>

      <div className="space-y-8">
        {rulesSections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 font-display text-lg font-bold">{section.heading}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-ink/80">
              {section.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-ink/10 bg-cream-card p-6 text-center">
        <p className="text-sm font-semibold text-ink/70">Find us on Facebook</p>
        <Image src="/facebook-qr.jpg" alt="QR code to the league's Facebook page" width={140} height={140} />
      </div>
    </div>
  );
}
