import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-xl font-bold">Committee login</h1>
      {error && (
        <p className="mb-4 rounded bg-loss/10 px-3 py-2 text-sm text-loss">
          {error}
        </p>
      )}
      <form action={login} className="space-y-4">
        <input type="hidden" name="next" value={next ?? "/admin"} />
        <div>
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-felt px-4 py-2 font-semibold text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
