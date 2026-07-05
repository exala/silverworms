import { verifyDriverOtpAction } from "@/app/actions/auth";
import { CheckPhoneResend } from "@/components/check-phone-resend";
import { FormPendingOverlay, PendingSubmitButton } from "@/components/form-status";

export default async function CheckPhonePage(props: {
  searchParams: Promise<{ error?: string; expires?: string; phone?: string }>;
}) {
  const searchParams = await props.searchParams;
  const phone = searchParams.phone || "";
  const expires = Number.parseInt(searchParams.expires || "60", 10);

  return (
    <section className="mx-auto mt-8 w-[min(780px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Verify Phone
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        Enter the OTP sent by SMS.
      </h1>
      <p className="mt-4 text-base leading-8 text-silver-600">
        We sent a one-time code to <strong>{phone}</strong>. Use it within{" "}
        {expires} seconds to continue driver registration.
      </p>
      {searchParams.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {searchParams.error}
        </p>
      ) : null}
      <form action={verifyDriverOtpAction} className="mt-6 space-y-5">
        <input name="phone" type="hidden" value={phone} />
        <label className="grid gap-2 text-sm font-semibold text-silver-700">
          OTP
          <input
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            name="token"
            placeholder="123456"
            required
          />
        </label>
        <PendingSubmitButton idleLabel="Verify and continue" pendingLabel="Verifying..." />
        <FormPendingOverlay label="Verifying your driver phone number..." />
      </form>
      <CheckPhoneResend phone={phone} initialSeconds={Number.isNaN(expires) ? 60 : expires} />
    </section>
  );
}
