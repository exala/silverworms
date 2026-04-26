import Link from "next/link";
import { createCampaignAction } from "@/app/actions/campaigns";
import { CampaignForm } from "@/components/campaign-form";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function NewCampaignPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("company_profiles")
    .select("user_id, company_name")
    .order("company_name", { ascending: true });

  return (
    <CampaignForm
      action={createCampaignAction}
      companies={companies || []}
      error={searchParams.error}
      intro="Define the company, campaign window, pricing rate, format, and extra targeting details for the LED screens."
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
      submitLabel="Create campaign"
      title="Add an advertising campaign."
    />
  );
}
