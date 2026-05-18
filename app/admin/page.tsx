import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.8rem] border border-silver-200/80 bg-white/90 p-6 shadow-sm">
      <span className="text-sm font-medium text-silver-500">{label}</span>
      <strong className="mt-2 block text-5xl font-semibold tracking-[-0.06em] text-silver-900">
        {value}
      </strong>
    </div>
  );
}

export default async function AdminPage(props: {
  searchParams: Promise<{ success?: string }>;
}) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const [
    { count: driverCount },
    { count: companyCount },
    { count: campaignCount },
    { count: liveCampaignCount },
  ] =
    await Promise.all([
      supabase.from("driver_profiles").select("*", { count: "exact", head: true }),
      supabase.from("company_profiles").select("*", { count: "exact", head: true }),
      supabase.from("campaigns").select("*", { count: "exact", head: true }),
      supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("status", "LIVE"),
    ]);
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, campaign_name, status, rate_amount, rate_unit, rate_value, company_profiles(company_name)")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <section className="mx-auto mt-8 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Admin Panel
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900 md:text-5xl">
        Campaign and onboarding control center.
      </h1>
      {searchParams.success ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {searchParams.success}
        </p>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Registered drivers" value={driverCount || 0} />
        <StatCard label="Registered companies" value={companyCount || 0} />
        <StatCard label="Total campaigns" value={campaignCount || 0} />
        <StatCard label="Live campaigns" value={liveCampaignCount || 0} />
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          className="inline-flex min-h-14 items-center justify-center rounded-full border border-silver-200 bg-white px-7 py-4 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-silver-50"
          href="/admin/drivers"
        >
          Drivers
        </Link>
        <Link
          className="inline-flex min-h-14 items-center justify-center rounded-full border border-silver-200 bg-white px-7 py-4 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-silver-50"
          href="/admin/companies"
        >
          Companies
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-silver-200/80 bg-white/90 shadow-sm">
        <div className="border-b border-silver-200/80 px-6 py-5">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-silver-900">
            Recent campaigns
          </h2>
        </div>
        {!campaigns?.length ? (
          <p className="px-6 py-5 text-sm text-silver-500">No campaigns created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-silver-50 text-silver-500">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Campaign</th>
                  <th className="px-6 py-4 text-left font-medium">Company</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Rate</th>
                  <th className="px-6 py-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  const company = Array.isArray(campaign.company_profiles)
                    ? campaign.company_profiles[0]
                    : campaign.company_profiles;

                  return (
                    <tr key={campaign.id} className="border-t border-silver-100">
                      <td className="px-6 py-4 text-silver-900">{campaign.campaign_name}</td>
                      <td className="px-6 py-4 text-silver-600">
                        {company?.company_name || "Unknown company"}
                      </td>
                      <td className="px-6 py-4 text-silver-600">{campaign.status}</td>
                      <td className="px-6 py-4 text-silver-600">
                        ${campaign.rate_amount} / {campaign.rate_value} {campaign.rate_unit}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          className="font-medium text-silver-800 underline-offset-4 hover:underline"
                          href={`/admin/campaigns/${campaign.id}/edit`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
