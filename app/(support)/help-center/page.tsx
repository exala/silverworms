import Link from "next/link";
import { Mail, LifeBuoy, Bug, BookOpen, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Help Center",
  description: "Get help, contact support, and report issues.",
};

export default function HelpCenterPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <LifeBuoy className="mx-auto mb-6 h-14 w-14 text-blue-600" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Help Center
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Need assistance? We're here to help. Browse our support resources,
            contact our team, or report a technical issue.
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Contact Support */}
          <div className="rounded-xl border bg-white p-8 shadow-sm transition hover:shadow-lg">
            <Mail className="mb-5 h-10 w-10 text-blue-600" />

            <h2 className="text-xl font-semibold text-gray-900">
              Contact Support
            </h2>

            <p className="mt-3 text-gray-600">
              Reach out to our support team for account, billing, or technical
              assistance.
            </p>

            <Link
              href="/contact-support"
              className="mt-6 inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Report Issue */}
          <div className="rounded-xl border bg-white p-8 shadow-sm transition hover:shadow-lg">
            <Bug className="mb-5 h-10 w-10 text-red-600" />

            <h2 className="text-xl font-semibold text-gray-900">
              Report an Issue
            </h2>

            <p className="mt-3 text-gray-600">
              Found a bug or something isn't working correctly? Let us know so
              we can investigate.
            </p>

            <Link
              href="/report-issue"
              className="mt-6 inline-flex items-center font-medium text-red-600 hover:text-red-700"
            >
              Report Issue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Documentation */}
          <div className="rounded-xl border bg-white p-8 shadow-sm transition hover:shadow-lg">
            <BookOpen className="mb-5 h-10 w-10 text-green-600" />

            <h2 className="text-xl font-semibold text-gray-900">
              Documentation
            </h2>

            <p className="mt-3 text-gray-600">
              Browse our guides, FAQs, and documentation to quickly find
              answers.
            </p>

            <Link
              href="/faqs"
              className="mt-6 inline-flex items-center font-medium text-green-600 hover:text-green-700"
            >
              View FAQs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}