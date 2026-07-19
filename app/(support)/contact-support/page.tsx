import { Mail, Clock, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Support",
  description: "Get in touch with our support team.",
};

export default function ContactSupportPage() {
  return (
    <main className="bg-white">
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-4xl font-bold">Contact Support</h1>

          <p className="mt-4 text-gray-600">
            Need help with your account or experiencing a problem? Send us a
            message and our support team will get back to you as soon as
            possible.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-3">

          {/* Support Information */}
          <div className="space-y-8">
            <div>
              <Mail className="mb-2 h-6 w-6 text-blue-600" />
              <h2 className="font-semibold">Email</h2>
              <p className="text-gray-600">
                support@silverworms.com
              </p>
            </div>

            <div>
              <Clock className="mb-2 h-6 w-6 text-blue-600" />
              <h2 className="font-semibold">Support Hours</h2>
              <p className="text-gray-600">
                Monday – Friday
                <br />
                9:00 AM – 6:00 PM
              </p>
            </div>

            <div>
              <MessageSquare className="mb-2 h-6 w-6 text-blue-600" />
              <h2 className="font-semibold">Response Time</h2>
              <p className="text-gray-600">
                We usually reply within 1–2 business days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 rounded-xl border p-8">
            <form className="space-y-6">

              <div>
                <label className="mb-2 block font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border p-3"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border p-3"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border p-3"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Message
                </label>

                <textarea
                  rows={6}
                  className="w-full rounded-lg border p-3"
                  placeholder="Describe your issue..."
                />
              </div>

              <button
                className="rounded-lg bg-silver-900 px-6 py-3 font-medium text-white hover:bg-silver-700"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </section>
    </main>
  );
}