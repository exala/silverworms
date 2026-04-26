import Link from "next/link";
import { redirect } from "next/navigation";
import { updateCampaignAction } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/campaign-form";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEditCampaignPage(
  props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ error?: string }>;
  },
) {
  await requireAdmin();
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const [{ data: companies }, { data: campaign }] = await Promise.all([
    supabase
      .from("company_profiles")
      .select("user_id, company_name")
      .order("company_name", { ascending: true }),
    supabase.from("campaigns").select("*").eq("id", id).single(),
  ]);

  if (!campaign) {
    redirect("/admin");
  }

  return (
    <CampaignForm
      action={updateCampaignAction.bind(null, id)}
      companies={companies || []}
      error={searchParams.error}
      initialValues={campaign}
      intro="Modify campaign ownership, rate structure, schedule, and creative details on behalf of a company."
      links={
        <div className="flex flex-wrap gap-3 text-sm font-medium text-silver-600">
          <Link
            className="rounded-full border border-silver-200 bg-white px-4 py-2.5 transition hover:border-silver-300 hover:bg-silver-50 hover:text-silver-900"
            href="/admin"
          >
            Admin Home
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
      title="Edit a company campaign."
    />
  );
}
