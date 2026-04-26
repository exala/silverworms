import { redirect } from "next/navigation";
import { completeRegistrationAction } from "@/app/actions/registration";
import { CompanyTermsModal } from "@/components/company-terms-modal";
import { FormPendingOverlay, PendingSubmitButton } from "@/components/form-status";
import { getCurrentProfile, requireUser } from "@/lib/auth";

const labelClass = "grid gap-2 text-sm font-semibold text-silver-700";

function DriverFields() {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          CNIC
          <input name="cnic" placeholder="42101-1234567-8" required />
        </label>
        <label className={labelClass}>
          Driving license number
          <input name="licenseNumber" required />
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Ride-hailing platform
          <input name="ridePlatform" placeholder="Uber, Careem, InDrive" required />
        </label>
        <label className={labelClass}>
          LED screen serial
          <input name="ledScreenSerial" placeholder="Optional at registration" />
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <label className={labelClass}>
          Car make
          <input name="carMake" required />
        </label>
        <label className={labelClass}>
          Car model
          <input name="carModel" required />
        </label>
        <label className={labelClass}>
          Car year
          <input max="2035" min="2000" name="carYear" required type="number" />
        </label>
      </div>
      <label className={labelClass}>
        Plate number
        <input name="plateNumber" required />
      </label>
    </>
  );
}

function CompanyFields() {
  return (
    <>
      <CompanyTermsModal />
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Company name
          <input name="companyName" required />
        </label>
        <label className={labelClass}>
          Contact person
          <input name="contactPerson" required />
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Industry
          <input name="industry" placeholder="Retail, FMCG, Telecom" required />
        </label>
        <label className={labelClass}>
          Website
          <input name="website" placeholder="https://example.com" />
        </label>
      </div>
      <label className={labelClass}>
        Business address
        <textarea name="address" required />
      </label>
      <div className="grid gap-5 md:grid-cols-3">
        <label className={labelClass}>
          Tax identifier
          <input name="taxIdentifier" placeholder="General tax ID" />
        </label>
        <label className={labelClass}>
          NTN
          <input name="ntn" required />
        </label>
        <label className={labelClass}>
          FBR registration
          <input name="fbrRegistration" placeholder="STRN or FBR registration no." required />
        </label>
      </div>
      <label className={labelClass}>
        Monthly marketing budget (in PKR)
        <input min="0" name="marketingBudget" step="0.01" type="number" />
      </label>
    </>
  );
}

export default async function CompleteRegistrationPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const profile = await getCurrentProfile();
  const searchParams = await props.searchParams;

  if (!profile) {
    return null;
  }

  if (profile.registration_completed) {
    redirect(profile.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <section className="mx-auto mt-8 w-[min(900px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Complete Registration
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        Finish your {profile.role.toLowerCase()} account setup.
      </h1>
      <p className="mt-4 text-base leading-8 text-silver-600">
        Your email is verified. Add the remaining details below so your account can
        be reviewed and activated properly.
      </p>
      {searchParams.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {searchParams.error}
        </p>
      ) : null}
      <form action={completeRegistrationAction} className="mt-6 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Full name
            <input defaultValue={profile.full_name || ""} name="fullName" required />
          </label>
          <label className={labelClass}>
            Phone number
            <input defaultValue={profile.phone || ""} name="phone" required />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            City
            <input defaultValue={profile.city || ""} name="city" required />
          </label>
          <label className={labelClass}>
            Country
            <input defaultValue={profile.country || "Pakistan"} name="country" required />
          </label>
        </div>
        {profile.role === "DRIVER" ? <DriverFields /> : null}
        {profile.role === "COMPANY" ? <CompanyFields /> : null}
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Create password
            <input minLength={8} name="password" required type="password" />
          </label>
          <label className={labelClass}>
            Confirm password
            <input minLength={8} name="confirmPassword" required type="password" />
          </label>
        </div>
        <PendingSubmitButton idleLabel="Save and continue" pendingLabel="Saving..." />
        <FormPendingOverlay label="Creating your account profile..." />
      </form>
    </section>
  );
}
