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
        Drivers, companies, and admins can sign in here. Admin seeding is set up for{" "}
        <strong>admin@silverworms.com</strong>.
      </p>
      {searchParams.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {searchParams.error}
        </p>
      ) : null}
      <form action={signInAction} className="mt-6 space-y-5">
        <input
          name="redirectTo"
          type="hidden"
          value={searchParams.redirectTo || "/dashboard"}
        />
        <label className="grid gap-2 text-sm font-semibold text-silver-700">
          Email address
          <input name="email" required type="email" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-silver-700">
          Password
          <input name="password" required type="password" />
        </label>
        <PendingSubmitButton idleLabel="Sign in" pendingLabel="Signing in..." />
        <FormPendingOverlay label="Signing you in..." />
      </form>
      <p className="mt-5 text-sm text-silver-600">
        New here? <Link href="/sign-up">Create an account</Link>
      </p>
    </section>
  );
}
