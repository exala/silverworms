export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-2 text-4xl font-bold text-silver-900">
        Privacy Policy
      </h1>

      <p className="mb-8 text-sm text-silver-500">
        Last Updated: July 2026
      </p>

      <p className="mb-8 text-silver-700">
        Welcome to <strong>SILVERWORMS</strong>.
      </p>

      <p className="mb-10 text-silver-700">
        We value your privacy and are committed to protecting your personal
        information.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Information We Collect
        </h2>

        <p className="mb-4 text-silver-700">
          We may collect the following information:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-silver-700">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Company information</li>
          <li>Vehicle information (for drivers)</li>
          <li>Payment information</li>
          <li>Device information</li>
          <li>IP address</li>
          <li>Browser information</li>
          <li>Usage statistics</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          How We Use Your Information
        </h2>

        <p className="mb-4 text-silver-700">
          We use your information to:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-silver-700">
          <li>Create and manage your account.</li>
          <li>Process payments.</li>
          <li>Deliver advertising campaigns.</li>
          <li>Improve our services.</li>
          <li>Respond to support requests.</li>
          <li>Detect fraud and abuse.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Data Sharing
        </h2>

        <p className="mb-4 text-silver-700">
          We do not sell your personal information.
        </p>

        <p className="mb-4 text-silver-700">
          We may share information with:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-silver-700">
          <li>Payment providers</li>
          <li>Cloud hosting providers</li>
          <li>Analytics providers</li>
          <li>Government authorities when legally required</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Data Security
        </h2>

        <p className="text-silver-700">
          We use industry-standard security measures to protect your
          information. However, no online system is completely secure, and we
          cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Your Rights
        </h2>

        <p className="mb-4 text-silver-700">
          You may:
        </p>

        <ul className="list-disc space-y-2 pl-6 text-silver-700">
          <li>Access your personal data.</li>
          <li>Request corrections.</li>
          <li>Request deletion of your account.</li>
          <li>Withdraw marketing consent.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Contact
        </h2>

        <p className="text-silver-700">
          For privacy-related questions, please contact us at:
        </p>

        <a
          href="mailto:privacy@silverworms.com"
          className="mt-2 inline-block font-medium text-blue-600 hover:underline"
        >
          privacy@silverworms.com
        </a>
      </section>
    </main>
  );
}