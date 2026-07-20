import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mb-8 mt-10 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/70 px-6 py-8 shadow-float backdrop-blur-xl md:px-8">
      <div className="grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-bold text-silver-900">SILVERWORMS</h3>
          <p className="mt-2 text-sm text-silver-600">
            LED-powered in-car passenger advertising platform connecting brands
            with ride-hailing fleets.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-3 font-semibold text-silver-900">Company</h4>
          <ul className="space-y-2 text-sm text-silver-600">
            <li>
              <Link href="/about" className="hover:text-silver-900">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-silver-900">
                Contact
              </Link>
            </li>
            {/* <li>
              <Link href="/pricing" className="hover:text-silver-900">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-silver-900">
                FAQ
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="mb-3 font-semibold text-silver-900">Legal</h4>
          <ul className="space-y-2 text-sm text-silver-600">
            <li>
              <Link href="/privacy-policy" className="hover:text-silver-900">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-silver-900">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-silver-900">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="hover:text-silver-900">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-3 font-semibold text-silver-900">Support</h4>
          <ul className="space-y-2 text-sm text-silver-600">
            <li>
              <Link href="/help-center" className="hover:text-silver-900">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/contact-support" className="hover:text-silver-900">
                Contact Support
              </Link>
            </li>
            <li>
              <Link href="/report-issue" className="hover:text-silver-900">
                Report an Issue
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:text-silver-900">
                FAQs
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-silver-200 pt-6 text-sm text-silver-500 md:flex-row">
        <p>© {year} SILVERWORMS. All rights reserved.</p>

        <div className="flex gap-4">
          <Link href="https://facebook.com" target="_blank" className="hover:text-silver-900">
            Facebook
          </Link>
          <Link href="https://linkedin.com" target="_blank" className="hover:text-silver-900">
            LinkedIn
          </Link>
          <Link href="https://instagram.com" target="_blank" className="hover:text-silver-900">
            Instagram
          </Link>
        </div>
      </div>
    </footer>
  );
}