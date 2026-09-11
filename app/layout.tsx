import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentSeason } from "@/lib/data";
import "./globals.css";

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
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header seasonName={season?.name} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
