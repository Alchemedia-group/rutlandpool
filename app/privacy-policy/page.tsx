export const metadata = {
  title: "Privacy Policy — Rutland County Pool League",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-ink/50">Last updated 16 September 2026</p>

      <p className="mt-6 text-ink/80">
        This policy covers the Rutland County Pool League website
        (rutlandcountypoolleague.com) and the Rutland County Pool League app
        for iOS and Android, which simply displays the website. We collect
        very little information, and we never sell or share it with third
        parties for advertising.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What we collect</h2>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-ink/80">
        <li>
          <strong>Contact form.</strong> If you use the contact form, we
          store the name, email address, and message you provide, so the
          league committee can reply to you.
        </li>
        <li>
          <strong>Match and squad information.</strong> Team names, fixtures,
          results, and player names entered by team captains or the
          committee are published on the site as part of running the league.
        </li>
        <li>
          <strong>Committee login.</strong> Committee members who log in to
          the admin area have an email or username and password, used only
          to control access to the admin tools.
        </li>
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Analytics</h2>
      <p className="mt-2 text-ink/80">
        The website uses Google Analytics to understand how many people
        visit and which pages are popular. This sets a cookie in your
        browser and records anonymised, aggregate usage data — it
        doesn&apos;t identify you personally, and we don&apos;t use it for
        advertising. You can opt out using a browser extension such as the{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          className="text-felt underline"
        >
          Google Analytics Opt-out Add-on
        </a>
        . Because the app displays the same website pages, this same
        analytics also runs when you use the app — there&apos;s no separate
        app-only tracking on top of it.
      </p>

      <h2 className="mt-8 text-lg font-semibold">The app</h2>
      <p className="mt-2 text-ink/80">
        The iOS and Android app is a simple wrapper around this website —
        it doesn&apos;t collect any information beyond what&apos;s described
        above, use location data, or send push notifications.
      </p>

      <h2 className="mt-8 text-lg font-semibold">How we store data</h2>
      <p className="mt-2 text-ink/80">
        Data is stored securely with our database provider, Supabase, and
        only committee members with a login can access contact messages or
        the admin area.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Your rights</h2>
      <p className="mt-2 text-ink/80">
        You can ask us to tell you what information we hold about you, or to
        correct or delete it, at any time — see the{" "}
        <a href="/contact" className="text-felt underline">
          contact page
        </a>
        .
      </p>

      <h2 className="mt-8 text-lg font-semibold">Contact</h2>
      <p className="mt-2 text-ink/80">
        Questions about this policy or your data can be sent via the{" "}
        <a href="/contact" className="text-felt underline">
          contact page
        </a>
        .
      </p>
    </div>
  );
}
