export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Rutland County Pool League.
        </p>
        <p className="mt-1">
          <a href="/contact" className="underline hover:text-gray-700">
            Contact
          </a>
          {" · "}
          <a href="/admin/login" className="underline hover:text-gray-700">
            Committee login
          </a>
        </p>
      </div>
    </footer>
  );
}
