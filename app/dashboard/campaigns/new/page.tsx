import Link from "next/link";
import { redirect } from "next/navigation";
import { createCampaignAction } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/campaign-form";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function CompanyNewCampaignPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const profile = await getCurrentProfile();
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  if (!profile || profile.role !== "COMPANY") {
    redirect("/dashboard");
  }

  const { data: company } = await supabase
    .from("company_profiles")
    .select("user_id, company_name")
    .eq("user_id", profile.id)
    .single();

  return (
    <CampaignForm
      action={createCampaignAction}
      companies={company ? [company] : []}
      companyId={company?.user_id}
      companyLabel={company?.company_name || "Your company"}
      companyLocked
      error={searchParams.error}
      intro="Create your own ad campaign with pricing, duration, targeting, and creative details."
      links={
        <div className="flex flex-wrap gap-3 text-sm font-medium text-silver-600">
          <Link
            className="rounded-full border border-silver-200 bg-white px-4 py-2.5 transition hover:border-silver-300 hover:bg-silver-50 hover:text-silver-900"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="rounded-full border border-silver-200 bg-white px-4 py-2.5 transition hover:border-silver-300 hover:bg-silver-50 hover:text-silver-900"
            href="/"
          >
            Home
          </Link>
        </div>
      }
      submitLabel="Create campaign"
      title="Create a company campaign."
    />
  );
}
