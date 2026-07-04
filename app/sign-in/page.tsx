import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { BackHomeLinks } from "@/components/back-home-links";
import { FormPendingOverlay, PendingSubmitButton } from "@/components/form-status";

export default async function SignInPage(props: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <section className="mx-auto mt-8 w-[min(780px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">Sign In</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        Access your SILVERWORMS account.
      </h1>
      <p className="mt-4 text-base leading-8 text-silver-600">
        Drivers sign in with phone and password. Companies and admins continue with
        email and password. Admin seeding is set up for{" "}
        <strong>admin@silverworms.com</strong>.
      </p>
      {searchParams.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {searchParams.error}
        </p>
      ) : null}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form action={signInAction} className="space-y-5 rounded-[1.5rem] border border-silver-100 bg-white/70 p-5">
          <input name="accountType" type="hidden" value="DRIVER" />
          <input
            name="redirectTo"
            type="hidden"
            value={searchParams.redirectTo || "/dashboard"}
          />
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-silver-500">
            Driver
          </p>
          <label className="grid gap-2 text-sm font-semibold text-silver-700">
            Phone number
            <input inputMode="tel" name="phone" placeholder="03013568887" required type="tel" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-silver-700">
            Password
            <input name="password" required type="password" />
          </label>
          <PendingSubmitButton idleLabel="Sign in as driver" pendingLabel="Signing in..." />
          <FormPendingOverlay label="Signing you in..." />
        </form>
        <form action={signInAction} className="space-y-5 rounded-[1.5rem] border border-silver-100 bg-white/70 p-5">
          <input name="accountType" type="hidden" value="EMAIL" />
          <input
            name="redirectTo"
            type="hidden"
            value={searchParams.redirectTo || "/dashboard"}
          />
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-silver-500">
            Company / Admin
          </p>
          <label className="grid gap-2 text-sm font-semibold text-silver-700">
            Email address
            <input name="email" required type="email" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-silver-700">
            Password
            <input name="password" required type="password" />
          </label>
          <PendingSubmitButton idleLabel="Sign in with email" pendingLabel="Signing in..." />
          <FormPendingOverlay label="Signing you in..." />
        </form>
      </div>
      <p className="mt-5 text-sm text-silver-600">
        New here? <Link href="/sign-up">Create an account</Link>
      </p>
    </section>
  );
}
