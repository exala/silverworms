export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-2 text-4xl font-bold text-silver-900">
        Terms &amp; Conditions
      </h1>

      <p className="mb-8 text-sm text-silver-500">
        Last Updated: July 2026
      </p>

      <p className="mb-10 text-silver-700">
        By using <strong>SILVERWORMS</strong>, you agree to these Terms and
        Conditions. Please read them carefully before accessing or using our
        platform.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Accounts
        </h2>

        <p className="text-silver-700">
          Users are responsible for maintaining accurate account information and
          protecting the confidentiality of their login credentials. You are
          responsible for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Advertisers
        </h2>

        <p className="mb-4 text-silver-700">
          Advertisers agree that:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-silver-700">
          <li>All submitted advertisements comply with applicable laws.</li>
          <li>
            Advertisements must not contain illegal, misleading, harmful, or
            offensive content.
          </li>
          <li>
            Campaign pricing, placement, and scheduling are determined by
            SILVERWORMS.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Drivers
        </h2>

        <p className="mb-4 text-silver-700">
          Drivers participating in the platform agree that:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-silver-700">
          <li>
            Devices provided by SILVERWORMS must remain installed while
            participating in the program.
          </li>
          <li>
            Drivers must not intentionally disable, modify, or tamper with the
            advertising device.
          </li>
          <li>
            Fraudulent activity, misuse, or attempts to manipulate campaign
            statistics may result in suspension or permanent termination of the
            account.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Payments
        </h2>

        <p className="text-silver-700">
          Advertisers are responsible for maintaining sufficient wallet balance
          before campaigns can be displayed. Campaigns may be paused
          automatically if the available balance becomes insufficient.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Liability
        </h2>

        <p className="text-silver-700">
          SILVERWORMS is not responsible for any indirect, incidental, special,
          or consequential damages arising from the use of the platform,
          including loss of revenue, profits, business opportunities, or data.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Termination
        </h2>

        <p className="text-silver-700">
          We reserve the right to suspend or permanently terminate any account
          that violates these Terms, engages in fraudulent activity, or uses the
          platform in a manner that could harm SILVERWORMS or other users.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Changes to These Terms
        </h2>

        <p className="text-silver-700">
          We may update these Terms and Conditions from time to time. Any
          changes will be published on this page with an updated revision date.
          Continued use of the platform after such changes constitutes your
          acceptance of the revised Terms.
        </p>
      </section>
    </main>
  );
}