export function SiteFooter() {
  return (
    <footer className="mx-auto mb-8 mt-10 flex w-[min(1180px,calc(100%-2rem))] flex-col justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/70 px-6 py-6 text-sm text-silver-600 shadow-float backdrop-blur-xl md:flex-row md:items-center md:px-8">
      <div className="max-w-xl">
        <strong className="block text-base font-semibold text-silver-900">SILVERWORMS</strong>
        <p className="mt-1">
          LED-powered vehicle advertising for ride-hailing fleets, brands, and
          urban campaigns.
        </p>
      </div>
      <div>
        <p>Karachi ready, US-inspired, built for measurable street-level reach.</p>
      </div>
    </footer>
  );
}
