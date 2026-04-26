import Link from "next/link";
import { resendMagicLinkAction } from "@/app/actions/auth";
import { FormPendingOverlay, PendingSubmitButton } from "@/components/form-status";

export default async function CheckEmailPage(props: {
  searchParams: Promise<{ email?: string; role?: string }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams.email || "";
  const role = (searchParams.role || "").toUpperCase();

  return (
    <section className="mx-auto mt-8 w-[min(780px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Check Email
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        We sent your activation link.
      </h1>
      <p className="mt-4 text-base leading-8 text-silver-600">
        Please open the message sent to <strong>{email}</strong> and use the temporary
        verification link. After that, you will continue to the full registration
        form.
      </p>
      <form action={resendMagicLinkAction} className="mt-6">
        <input name="email" type="hidden" value={email} />
        <input name="role" type="hidden" value={role} />
        <PendingSubmitButton
          className="inline-flex min-h-14 items-center justify-center rounded-full border border-silver-200 bg-white px-7 py-4 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-silver-50"
          idleLabel="Resend email"
          pendingLabel="Resending..."
        />
        <FormPendingOverlay label="Sending another verification email..." />
      </form>
    </section>
  );
}
