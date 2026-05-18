export default function ContactPage() {
  return (
    <section className="mx-auto mt-8 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Contact Us
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900 md:text-5xl">
        Talk to the SILVERWORMS team.
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-silver-600">
        Use this page as the contact surface for driver support, brand
        outreach, or partnership conversations.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Business Inquiries
          </h2>
          <p className="mt-3 font-medium text-silver-800">sales@silverworms.com</p>
          <p className="mt-2 text-sm leading-7 text-silver-600">
            For brand campaigns, fleet partnerships, and city launches.
          </p>
        </div>
        <div className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Driver Support
          </h2>
          <p className="mt-3 font-medium text-silver-800">support@silverworms.com</p>
          <p className="mt-2 text-sm leading-7 text-silver-600">
            For onboarding questions, installation scheduling, and payouts.
          </p>
        </div>
      </div>
    </section>
  );
}
