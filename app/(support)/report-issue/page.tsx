import { Bug } from "lucide-react";

export const metadata = {
  title: "Report an Issue",
  description: "Report bugs and technical problems.",
};

export default function ReportIssuePage() {
  return (
    <main className="bg-white">

      <section className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Bug className="mb-5 h-12 w-12 text-red-600" />

          <h1 className="text-4xl font-bold">
            Report an Issue
          </h1>

          <p className="mt-4 text-gray-600">
            Found a bug or something isn't working correctly? Tell us what
            happened and we'll investigate it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">

        <div className="rounded-xl border p-8">

          <form className="space-y-6">

            <div>
              <label className="mb-2 block font-medium">
                Name
              </label>

              <input
                className="w-full rounded-lg border p-3"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                className="w-full rounded-lg border p-3"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Issue Category
              </label>

              <select className="w-full rounded-lg border p-3">
                <option>Bug</option>
                <option>Account</option>
                <option>Payment</option>
                <option>Performance</option>
                <option>Feature Request</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Page or URL
              </label>

              <input
                className="w-full rounded-lg border p-3"
                placeholder="https://example.com/dashboard"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Describe the Issue
              </label>

              <textarea
                rows={7}
                className="w-full rounded-lg border p-3"
                placeholder="Please describe what happened, what you expected to happen, and any steps to reproduce the issue."
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Attachment (optional)
              </label>

              <input
                type="file"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <button
              className="rounded-lg bg-silver-600 px-6 py-3 font-medium text-white hover:bg-silver-700"
            >
              Submit Report
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}