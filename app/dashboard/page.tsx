import Link from "next/link";
import type { ReactNode } from "react";
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
    const [{ data: driver }, { data: earnings }, { data: payoutMethod }] = await Promise.all([
      supabase.from("driver_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("driver_earnings").select("amount, earned_at").eq("driver_id", user.id),
      supabase.from("driver_payout_methods").select("*").eq("user_id", user.id).maybeSingle(),
    ]);
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const monthKey = now.toISOString().slice(0, 7);
    const totalEarned =
      earnings?.reduce((sum, earning) => sum + Number(earning.amount || 0), 0) || 0;
    const todayEarned =
      earnings
        ?.filter((earning) => earning.earned_at?.slice(0, 10) === todayKey)
        .reduce((sum, earning) => sum + Number(earning.amount || 0), 0) || 0;
    const monthEarned =
      earnings
        ?.filter((earning) => earning.earned_at?.slice(0, 7) === monthKey)
        .reduce((sum, earning) => sum + Number(earning.amount || 0), 0) || 0;

    detailCard = (
      <>
        <div className="grid gap-4 lg:col-span-2 md:grid-cols-3">
          <InfoCard>
            <span className="text-sm font-medium text-silver-500">Today</span>
            <strong className="mt-2 block text-4xl font-semibold tracking-[-0.05em] text-silver-900">
              Rs. {todayEarned.toLocaleString("en-PK")}
            </strong>
          </InfoCard>
          <InfoCard>
            <span className="text-sm font-medium text-silver-500">This month</span>
            <strong className="mt-2 block text-4xl font-semibold tracking-[-0.05em] text-silver-900">
              Rs. {monthEarned.toLocaleString("en-PK")}
            </strong>
          </InfoCard>
          <InfoCard>
            <span className="text-sm font-medium text-silver-500">Total earned</span>
            <strong className="mt-2 block text-4xl font-semibold tracking-[-0.05em] text-silver-900">
              Rs. {totalEarned.toLocaleString("en-PK")}
            </strong>
          </InfoCard>
        </div>
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
        <InfoCard>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Payout method
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-silver-600">
            <p>
              <strong className="font-semibold text-silver-900">Method:</strong>{" "}
              {payoutMethod?.method_type || "Not added yet"}
            </p>
            <p>
              <strong className="font-semibold text-silver-900">Account title:</strong>{" "}
              {payoutMethod?.account_title || "Not set"}
            </p>
            <p>
              <strong className="font-semibold text-silver-900">Account number:</strong>{" "}
              {payoutMethod?.account_number || "Not set"}
            </p>
          </div>
        </InfoCard>
      </>
    );
  }

  if (profile.role === "COMPANY") {
    const [{ data: company }, { data: campaigns }, { count: activeVehicleCount }] = await Promise.all([
      supabase.from("company_profiles").select("*").eq("user_id", user.id).single(),
      supabase
        .from("campaigns")
        .select("id, campaign_name, status, rate_amount, rate_unit, rate_value, budget")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("driver_profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "ACTIVE"),
    ]);
    const campaignIds = campaigns?.map((campaign) => campaign.id) || [];
    const { data: campaignEarnings } = campaignIds.length
      ? await supabase
          .from("driver_earnings")
          .select("campaign_id, amount")
          .in("campaign_id", campaignIds)
      : { data: [] };
    const spentByCampaign = new Map<string, number>();

    campaignEarnings?.forEach((earning) => {
      const campaignId = String(earning.campaign_id || "");
      spentByCampaign.set(
        campaignId,
        (spentByCampaign.get(campaignId) || 0) + Number(earning.amount || 0),
      );
    });

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
        <div className="grid gap-4 lg:col-span-2 md:grid-cols-2">
          <InfoCard>
            <span className="text-sm font-medium text-silver-500">Live active vehicles</span>
            <strong className="mt-2 block text-5xl font-semibold tracking-[-0.06em] text-silver-900">
              {activeVehicleCount || 0}
            </strong>
          </InfoCard>
          <InfoCard>
            <span className="text-sm font-medium text-silver-500">Live campaigns</span>
            <strong className="mt-2 block text-5xl font-semibold tracking-[-0.06em] text-silver-900">
              {campaigns?.filter((campaign) => campaign.status === "LIVE").length || 0}
            </strong>
          </InfoCard>
        </div>
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
                    <th className="px-6 py-4 text-left font-medium">Remaining</th>
                    <th className="px-6 py-4 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-t border-silver-100">
                      <td className="px-6 py-4 text-silver-900">{campaign.campaign_name}</td>
                      <td className="px-6 py-4 text-silver-600">{campaign.status}</td>
                      <td className="px-6 py-4 text-silver-600">
                        Rs. {Number(campaign.rate_amount || 0).toLocaleString("en-PK")} / {campaign.rate_value} {campaign.rate_unit}
                      </td>
                      <td className="px-6 py-4 text-silver-600">
                        Rs. {Math.max(Number(campaign.budget || 0) - (spentByCampaign.get(campaign.id) || 0), 0).toLocaleString("en-PK")}
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
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">{detailCard}</div>
    </section>
  );
}
