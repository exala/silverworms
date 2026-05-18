export default function AboutPage() {
  return (
    <section className="mx-auto mt-8 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        About
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900 md:text-5xl">
        In-car advertising with a driver-first model.
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-silver-600">
        SILVERWORMS is designed for ride-hailing ecosystems where drivers
        need new income channels and companies want campaigns that reach
        passengers throughout the day.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">Drivers</h2>
          <p className="mt-3 text-sm leading-7 text-silver-600">
            Drivers register with their vehicle, platform, and verification
            details. Approved drivers can later be assigned to campaigns and
            build steady passive earnings.
          </p>
        </div>
        <div className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Companies
          </h2>
          <p className="mt-3 text-sm leading-7 text-silver-600">
            Companies create an account, complete NTN and FBR information, and
            submit campaigns for in-car passenger screens.
          </p>
        </div>
        <div className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Admin Team
          </h2>
          <p className="mt-3 text-sm leading-7 text-silver-600">
            Admin users oversee onboarding, review driver and company records,
            and monitor the campaigns that run on LED-equipped cars.
          </p>
        </div>
      </div>
    </section>
  );
}
