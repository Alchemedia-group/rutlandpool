import type { Metadata } from "next";
import { Zilla_Slab, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentSeason } from "@/lib/data";
import "./globals.css";

const displayFont = Zilla_Slab({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Rutland County Pool League",
  description:
    "Fixtures, results, standings, teams and stats for the Rutland County Pool League.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const season = await getCurrentSeason();

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink">
        <Header seasonName={season?.name} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
