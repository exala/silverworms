import Link from "next/link";

export function BackHomeLinks() {
  return (
    <div className="mb-6 flex flex-wrap gap-3 text-sm font-medium text-silver-600">
      <Link
        className="rounded-full border border-silver-200 bg-white/80 px-4 py-2.5 transition hover:border-silver-300 hover:bg-white hover:text-silver-900"
        href="/"
      >
        Home
      </Link>
      <Link
        className="rounded-full border border-silver-200 bg-white/80 px-4 py-2.5 transition hover:border-silver-300 hover:bg-white hover:text-silver-900"
        href="/join-us"
      >
        Back
      </Link>
    </div>
  );
}
