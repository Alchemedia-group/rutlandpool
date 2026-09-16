export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 bg-cream-card">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink/50">
        <p>
          &copy; {new Date().getFullYear()} Rutland County Pool League.
        </p>
        <p className="mt-1">
          <a href="/about" className="underline hover:text-ink/80">
            About
          </a>
          {" · "}
          <a href="/contact" className="underline hover:text-ink/80">
            Contact
          </a>
          {" · "}
          <a href="/privacy-policy" className="underline hover:text-ink/80">
            Privacy Policy
          </a>
          {" · "}
          <a href="/admin/login" className="underline hover:text-ink/80">
            Committee login
          </a>
        </p>
      </div>
    </footer>
  );
}
