import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/actions/auth";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm">
      {children}
    </div>
  );
}

export default async function DashboardPage(props: {
  searchParams: Promise<{ success?: string }>;
}) {
  const user = await requireUser();
  const profile = await getCurrentProfile();
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  if (!profile) {
    return null;
  }

  let detailCard: ReactNode = null;

  if (profile.role === "DRIVER") {
    const { data: driver } = await supabase
      .from("driver_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    detailCard = (
      <InfoCard>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
          Driver profile
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-silver-600">
          <p>
            <strong className="font-semibold text-silver-900">Ride platform:</strong>{" "}
            {driver?.ride_hailing_platform || "Not set"}
          </p>
          <p>
            <strong className="font-semibold text-silver-900">Vehicle:</strong>{" "}
            {driver?.car_make || "-"} {driver?.car_model || ""} {driver?.car_year || ""}
          </p>
          <p>
            <strong className="font-semibold text-silver-900">Plate number:</strong>{" "}
            {driver?.plate_number || "Not set"}
          </p>
          <p>
            <strong className="font-semibold text-silver-900">Status:</strong>{" "}
            {driver?.status || "Active"}
          </p>
        </div>
      </InfoCard>
    );
  }

  if (profile.role === "COMPANY") {
    const [{ data: company }, { data: campaigns }] = await Promise.all([
      supabase.from("company_profiles").select("*").eq("user_id", user.id).single(),
      supabase
        .from("campaigns")
        .select("id, campaign_name, status, rate_amount, rate_unit, rate_value")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    detailCard = (
      <>
        <InfoCard>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Company profile
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-silver-600">
            <p>
              <strong className="font-semibold text-silver-900">Company:</strong>{" "}
              {company?.company_name || "Not set"}
            </p>
            <p>
              <strong className="font-semibold text-silver-900">NTN:</strong>{" "}
              {company?.ntn || "Not set"}
            </p>
            <p>
              <strong className="font-semibold text-silver-900">FBR registration:</strong>{" "}
              {company?.fbr_registration || "Not set"}
            </p>
            <p>
              <strong className="font-semibold text-silver-900">Verification:</strong>{" "}
              {company?.verification_status || "Verified"}
            </p>
          </div>
        </InfoCard>
        <div className="overflow-hidden rounded-[1.8rem] border border-silver-200/80 bg-white/90 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-silver-200/80 px-6 py-5">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">Campaigns</h2>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-silver-900 px-5 py-3 text-sm font-semibold text-white shadow-float transition hover:bg-silver-700"
              href="/dashboard/campaigns/new"
            >
              Add campaign
            </Link>
          </div>
          {!campaigns?.length ? (
            <div className="px-6 py-5">
              <p className="text-sm text-silver-500">No campaigns yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-silver-50 text-silver-500">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Name</th>
                    <th className="px-6 py-4 text-left font-medium">Status</th>
                    <th className="px-6 py-4 text-left font-medium">Rate</th>
                    <th className="px-6 py-4 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-t border-silver-100">
                      <td className="px-6 py-4 text-silver-900">{campaign.campaign_name}</td>
                      <td className="px-6 py-4 text-silver-600">{campaign.status}</td>
                      <td className="px-6 py-4 text-silver-600">
                        ${campaign.rate_amount} / {campaign.rate_value} {campaign.rate_unit}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          className="font-medium text-silver-800 underline-offset-4 hover:underline"
                          href={`/dashboard/campaigns/${campaign.id}/edit`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <section className="mx-auto mt-8 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">Dashboard</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900 md:text-5xl">
        Welcome back, {profile.full_name || user.email}.
      </h1>
      {searchParams.success ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {searchParams.success}
        </p>
      ) : null}
      <div className="mt-6 grid gap-3 rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 md:grid-cols-3">
        <p className="text-sm text-silver-600">
          <strong className="font-semibold text-silver-900">Role:</strong> {profile.role}
        </p>
        <p className="text-sm text-silver-600">
          <strong className="font-semibold text-silver-900">Email:</strong> {user.email}
        </p>
        <p className="text-sm text-silver-600">
          <strong className="font-semibold text-silver-900">Registration:</strong>{" "}
          {profile.registration_completed ? "Completed" : "Pending"}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          className="inline-flex min-h-14 items-center justify-center rounded-full border border-silver-200 bg-white px-7 py-4 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-silver-50"
          href="/"
        >
          Home
        </Link>
        {profile.role === "ADMIN" ? (
          <Link
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-silver-200 bg-white px-7 py-4 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-silver-50"
            href="/admin"
          >
            Open Admin
          </Link>
        ) : null}
        <form action={signOutAction}>
          <button
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-silver-900 px-7 py-4 text-sm font-semibold text-white shadow-float transition hover:bg-silver-700"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">{detailCard}</div>
    </section>
  );
}
