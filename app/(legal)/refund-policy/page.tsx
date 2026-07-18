export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-12 py-12">
      <h1 className="mb-2 text-4xl font-bold text-silver-900">
        Refund Policy
      </h1>

      <p className="mb-8 text-sm text-silver-500">
        Last Updated: July 2026
      </p>

      <p className="mb-10 text-silver-700">
        This Refund Policy explains how refunds are handled for payments made
        through <strong>SILVERWORMS</strong>. By using our platform, you agree
        to the terms outlined below.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Wallet Top-Ups
        </h2>

        <p className="text-silver-700">
          Funds added to advertiser wallets are generally non-refundable once
          the payment has been successfully processed and credited to the
          account.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Campaign Cancellation
        </h2>

        <p className="text-silver-700">
          Advertisers may pause or cancel their advertising campaigns at any
          time through the platform. Cancellation will stop future campaign
          spending but will not automatically generate a refund for previously
          delivered advertisements.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Unused Balance
        </h2>

        <p className="text-silver-700">
          Any unused balance remaining in an advertiser's wallet may be retained
          and used for future advertising campaigns unless otherwise required by
          applicable law.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Refund Requests
        </h2>

        <p className="mb-4 text-silver-700">
          Refund requests may be considered under circumstances including, but
          not limited to:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-silver-700">
          <li>Duplicate payments.</li>
          <li>Failed campaign delivery.</li>
          <li>Billing or payment processing errors.</li>
          <li>Technical issues caused by SILVERWORMS.</li>
        </ul>

        <p className="mt-6 text-silver-700">
          Each refund request is reviewed individually. Approval is at the
          discretion of SILVERWORMS after verification of the reported issue.
        </p>

        <p className="mt-4 text-silver-700">
          Approved refunds will be processed using the original payment method
          whenever possible.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Processing Time
        </h2>

        <p className="text-silver-700">
          Approved refunds are typically processed within{" "}
          <strong>7–14 business days</strong>. The actual time required for the
          funds to appear in your account may vary depending on your payment
          provider or financial institution.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Contact
        </h2>

        <p className="text-silver-700">
          If you have any questions regarding this Refund Policy or wish to
          submit a refund request, please contact us at:
        </p>

        <a
          href="mailto:billing@silverworms.com"
          className="mt-2 inline-block font-medium text-blue-600 hover:underline"
        >
          billing@silverworms.com
        </a>
      </section>
    </main>
  );
}