import Link from "next/link";
import { redirect } from "next/navigation";
import { updateCampaignAction } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/campaign-form";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function CompanyEditCampaignPage(
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ error?: string }>;
  },
) {
  await requireUser();
  const profile = await getCurrentProfile();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  if (!profile || profile.role !== "COMPANY") {
    redirect("/dashboard");
  }

  const [{ data: company }, { data: campaign }] = await Promise.all([
    supabase
      .from("company_profiles")
      .select("user_id, company_name")
      .eq("user_id", profile.id)
      .single(),
    supabase.from("campaigns").select("*").eq("id", id).eq("company_id", profile.id).single(),
  ]);

  if (!campaign) {
    redirect("/dashboard");
  }

  return (
    <CampaignForm
      action={updateCampaignAction.bind(null, id)}
      companies={company ? [company] : []}
      companyId={company?.user_id}
      companyLabel={company?.company_name || "Your company"}
      companyLocked
      error={searchParams.error}
      initialValues={campaign}
      intro="Update your campaign details, pricing, run duration, and targeting."
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
      submitLabel="Update campaign"
      title="Edit your company campaign."
    />
  );
}
