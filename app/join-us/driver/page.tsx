import { sendJoinLinkAction } from "@/app/actions/auth";
import { BackHomeLinks } from "@/components/back-home-links";
import { FormPendingOverlay, PendingSubmitButton } from "@/components/form-status";

export default async function DriverJoinPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <section className="mx-auto mt-8 w-[min(780px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Driver Sign Up
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        Enter your email to start driver registration.
      </h1>
      <p className="mt-4 text-base leading-8 text-silver-600">
        We will send a temporary verification link to your email. After you click it,
        you will complete your driver and vehicle details.
      </p>
      {searchParams.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {searchParams.error}
        </p>
      ) : null}
      <form action={sendJoinLinkAction} className="mt-6 space-y-5">
        <input name="role" type="hidden" value="DRIVER" />
        <label className="grid gap-2 text-sm font-semibold text-silver-700">
          Email address
          <input name="email" placeholder="driver@example.com" required type="email" />
        </label>
        <PendingSubmitButton
          idleLabel="Send verification email"
          pendingLabel="Sending email..."
        />
        <FormPendingOverlay label="Sending your driver verification link..." />
      </form>
    </section>
  );
}
