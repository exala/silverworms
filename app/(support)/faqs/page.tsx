import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to commonly asked questions.",
};

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Click the Sign Up button on the homepage and complete the registration form. You'll receive a verification email before your account becomes active.",
  },
  {
    question: "I forgot my password. What should I do?",
    answer:
      "Click the 'Forgot Password' link on the login page and follow the instructions sent to your registered email address.",
  },
  {
    question: "How can I update my account information?",
    answer:
      "After signing in, navigate to your Account Settings where you can update your profile, password, and other personal information.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Visit our Contact Support page and submit the contact form. Our support team typically responds within 1–2 business days.",
  },
  {
    question: "How do I report a bug?",
    answer:
      "Use the Report an Issue page to describe the problem, include reproduction steps, and attach screenshots if available.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. We use industry-standard security practices to protect your information. Please review our Privacy Policy for more details.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes. You can request account deletion by contacting our support team. Some information may be retained where required by law.",
  },
  {
    question: "Where can I find your policies?",
    answer:
      "Our Privacy Policy, Terms & Conditions, Refund Policy, and Cookie Policy are available from the footer of every page.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <HelpCircle className="mx-auto mb-5 h-14 w-14 text-blue-600" />

          <h1 className="text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Find answers to the questions we receive most often. If you can't
            find what you're looking for, our support team is here to help.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h2>

              <p className="mt-3 text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Still Need Help?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            If your question isn't answered here, our support team will be happy
            to assist you.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact-support"
              className="inline-flex items-center justify-center rounded-lg bg-silver-900 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="/report-issue"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}