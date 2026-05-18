import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-col gap-6 pt-8">
      <section className="grid overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-haze backdrop-blur-xl lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:p-8">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
              Passenger Ad Platform
            </p>
            <h1 className="mt-4 max-w-[11ch] text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-silver-900 md:text-7xl">
              We put your ad where people are.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-silver-600 md:text-lg">
              SILVERWORMS helps drivers earn passive income by running LED
              campaigns on approved in-car passenger screens, while brands gain
              constant public visibility with people already on the move.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-silver-900 px-8 py-4 text-sm font-semibold text-white shadow-float transition hover:bg-silver-700"
              href="/join-us"
            >
              Join Us
            </Link>
            <Link
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-silver-200 bg-white/90 px-8 py-4 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-white"
              href="/sign-in"
            >
              Sign In
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-silver-200/80 bg-white/75 p-5 shadow-sm">
              <strong className="block text-base font-semibold text-silver-900">
                Driver earnings
              </strong>
              <p className="mt-2 text-sm leading-6 text-silver-600">
              Extra monthly income from approved LED ad time.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-silver-200/80 bg-white/75 p-5 shadow-sm">
              <strong className="block text-base font-semibold text-silver-900">
                Brand reach
              </strong>
              <p className="mt-2 text-sm leading-6 text-silver-600">
                Passenger-facing visibility during real city rides.
              </p>
            </div>
          </div>
        </div>
        <div className="relative mt-6 min-h-[460px] overflow-hidden rounded-[1.9rem] shadow-float lg:mt-0">
          <img
            alt="Night traffic in a city, representing moving outdoor advertising reach"
            className="h-full w-full object-cover"
            src="https://images.pexels.com/photos/4839255/pexels-photo-4839255.jpeg?auto=compress&cs=tinysrgb&w=1600"
          />
          <div className="absolute inset-x-5 bottom-5 grid gap-1 rounded-[1.5rem] border border-white/70 bg-white/85 px-5 py-4 backdrop-blur-xl">
            <span className="inline-flex w-fit rounded-full bg-silver-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-silver-600">
              In-car visibility
            </span>
            <strong className="text-lg font-semibold tracking-[-0.03em] text-silver-900">
              Run campaigns inside active ride-hailing vehicles.
            </strong>
            <span className="text-sm text-silver-600">
              Creative uploads, campaign budgets, and fleet approvals in one workflow.
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-haze backdrop-blur-xl md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
          Why It Works
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-silver-200/80 bg-white/85 p-6">
            <span className="text-sm font-medium text-silver-500">Driver incentive</span>
            <strong className="mt-2 block text-4xl font-semibold tracking-[-0.05em] text-silver-900">
              Passive income
            </strong>
            <p className="mt-3 text-sm leading-7 text-silver-600">
              Drivers can monetize time already spent on the road.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-silver-200/80 bg-white/85 p-6">
            <span className="text-sm font-medium text-silver-500">Brand impact</span>
            <strong className="mt-2 block text-4xl font-semibold tracking-[-0.05em] text-silver-900">
              Passenger attention
            </strong>
            <p className="mt-3 text-sm leading-7 text-silver-600">
              Campaigns meet people inside cars instead of relying on outside road visibility.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-haze backdrop-blur-xl md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
          Two-Sided Platform
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.9rem] border border-silver-200/80 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 aspect-[16/10] overflow-hidden rounded-[1.6rem]">
              <img
                alt="Taxi-filled city street for driver advertising opportunities"
                className="h-full w-full object-cover"
                src="https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1200"
              />
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-silver-900">
              For Drivers
            </h2>
            <p className="mt-3 text-sm leading-7 text-silver-600">
              Apply with your vehicle and ride-hailing details, get reviewed,
              and start earning from LED ad placements on approved cars.
            </p>
            <Link
              className="mt-5 inline-flex min-h-14 items-center justify-center rounded-full bg-silver-900 px-7 py-4 text-sm font-semibold text-white shadow-float transition hover:bg-silver-700"
              href="/join-us/driver"
            >
              Register as Driver
            </Link>
          </div>
          <div className="rounded-[1.9rem] border border-silver-200/80 bg-white/90 p-5 shadow-sm">
            <div className="mb-4 aspect-[16/10] overflow-hidden rounded-[1.6rem]">
              <img
                alt="Passenger using a phone during a city ride"
                className="h-full w-full object-cover"
                src="https://images.pexels.com/photos/30021846/pexels-photo-30021846.jpeg?auto=compress&cs=tinysrgb&w=1200"
              />
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-silver-900">
              For Companies
            </h2>
            <p className="mt-3 text-sm leading-7 text-silver-600">
              Start advertising with as low as Rs. 10,000 and place your brand
              on in-car passenger screens.
            </p>
            <Link
              className="mt-5 inline-flex min-h-14 items-center justify-center rounded-full bg-silver-900 px-7 py-4 text-sm font-semibold text-white shadow-float transition hover:bg-silver-700"
              href="/join-us/company"
            >
              Register as Company
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
