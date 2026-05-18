import Link from "next/link";

export default function JoinUsPage() {
  return (
    <section className="mx-auto mt-8 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Join Us
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900 md:text-5xl">
        Choose how you want to join the platform.
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-silver-600">
        Start with your email only. We will send an activation link first, and
        after verification you will complete the rest of the driver or company
        details.
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Link
          className="rounded-[1.9rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-float"
          href="/join-us/driver"
        >
          <span className="inline-flex rounded-full bg-silver-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-silver-600">
            Driver onboarding
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-silver-900">
            Register as a Driver
          </h2>
          <p className="mt-3 text-sm leading-7 text-silver-600">
            For ride-hailing drivers who want to install LED screens and earn
            passive income from active ad campaigns.
          </p>
        </Link>
        <Link
          className="rounded-[1.9rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-float"
          href="/join-us/company"
        >
          <span className="inline-flex rounded-full bg-silver-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-silver-600">
            Company onboarding
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-silver-900">
            Register as a Company
          </h2>
          <p className="mt-3 text-sm leading-7 text-silver-600">
            For brands and agencies that want to run in-car passenger ads with
            campaign budgets starting as low as Rs. 10,000.
          </p>
        </Link>
      </div>
    </section>
  );
}
