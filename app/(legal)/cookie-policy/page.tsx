export default function CookiePolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-12 py-12">
      <h1 className="mb-2 text-4xl font-bold text-silver-900">
        Cookie Policy
      </h1>

      <p className="mb-8 text-sm text-silver-500">
        Last Updated: July 2026
      </p>

      <p className="mb-10 text-silver-700">
        <strong>SILVERWORMS</strong> uses cookies and similar technologies to
        improve your browsing experience, enhance website performance, and
        provide personalized services. This Cookie Policy explains what cookies
        are, how we use them, and the choices available to you.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          What Are Cookies?
        </h2>

        <p className="text-silver-700">
          Cookies are small text files stored on your computer, tablet, or
          mobile device when you visit a website. They allow websites to
          remember information such as your preferences, login status, and
          browsing activity, making your experience faster and more convenient.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Types of Cookies We Use
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-xl font-medium text-silver-900">
              Essential Cookies
            </h3>
            <p className="text-silver-700">
              These cookies are necessary for the website to function properly.
              They enable features such as user authentication, account
              security, and core website functionality.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-medium text-silver-900">
              Performance Cookies
            </h3>
            <p className="text-silver-700">
              These cookies help us understand how visitors use our website,
              allowing us to improve performance, loading speed, and overall
              user experience.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-medium text-silver-900">
              Analytics Cookies
            </h3>
            <p className="text-silver-700">
              Analytics cookies collect anonymous information about website
              usage, such as page visits, traffic sources, and user
              interactions. This information helps us improve our platform.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-medium text-silver-900">
              Preference Cookies
            </h3>
            <p className="text-silver-700">
              These cookies remember your preferences, such as language
              selection and certain interface settings, to provide a more
              personalized experience.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Managing Cookies
        </h2>

        <p className="text-silver-700">
          Most web browsers allow you to manage or disable cookies through
          their settings. Please note that disabling certain cookies may affect
          the functionality of the website, and some features may not work as
          intended.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Third-Party Cookies
        </h2>

        <p className="text-silver-700">
          We may use trusted third-party services, such as analytics providers
          and payment processors, that place cookies on your device to help us
          understand website usage, improve our services, and process
          transactions securely.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-silver-900">
          Changes to This Cookie Policy
        </h2>

        <p className="text-silver-700">
          We may update this Cookie Policy from time to time to reflect changes
          in technology, legal requirements, or our business practices. Any
          updates will be posted on this page with a revised "Last Updated"
          date. Continued use of our website after changes become effective
          constitutes your acceptance of the revised Cookie Policy.
        </p>
      </section>
    </main>
  );
}