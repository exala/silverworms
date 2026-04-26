import Link from "next/link";
import { BackHomeLinks } from "@/components/back-home-links";

export default function SignUpPage() {
  return (
    <section className="mx-auto mt-8 w-[min(780px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">Sign Up</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        Create your account by choosing a registration type.
      </h1>
      <p className="mt-4 text-base leading-8 text-silver-600">
        Registration starts with email verification only, then continues with
        your driver or company details on the next screen.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Link
          className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-float"
          href="/join-us/driver"
        >
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Driver Sign Up
          </h2>
          <p className="mt-3 text-sm leading-7 text-silver-600">
            For ride-hailing drivers and vehicle owners.
          </p>
        </Link>
        <Link
          className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-float"
          href="/join-us/company"
        >
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Company Sign Up
          </h2>
          <p className="mt-3 text-sm leading-7 text-silver-600">
            For advertisers, brands, and agencies.
          </p>
        </Link>
      </div>
    </section>
  );
}
