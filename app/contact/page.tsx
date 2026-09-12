import { submitContactMessage } from "./actions";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Contact</h1>
      <p className="text-ink/80">
        For fixture queries, team entries, or anything else, get in touch with
        the league committee.
      </p>

      {sent && (
        <p className="mt-6 rounded border border-win/30 bg-win/10 px-4 py-3 text-sm text-win">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </p>
      )}
      {error && (
        <p className="mt-6 rounded border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
          {error === "missing"
            ? "Please fill in every field."
            : "Something went wrong sending your message — please try again."}
        </p>
      )}

      <form action={submitContactMessage} className="mt-6 space-y-4">
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
          />
        </div>
        <button type="submit" className="rounded bg-felt px-4 py-2 text-white">
          Send message
        </button>
      </form>
    </div>
  );
}
