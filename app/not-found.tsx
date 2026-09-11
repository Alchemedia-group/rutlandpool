import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink/50">
        <Link href="/" className="text-felt underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
