"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadCreativeToGoogleDrive } from "@/lib/google-drive";

type CampaignPayload = {
  company_id: string;
  campaign_name: string;
  status: string;
  ad_format: string;
  start_at: string | null;
  end_at: string | null;
  budget: number | null;
  rate_amount: number;
  rate_unit: string;
  rate_value: number;
  target_cities: string[];
  notes: string;
  creative_url?: string | null;
  creative_file_id?: string | null;
};

async function getActor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/sign-in");
  }

  return { supabase, user, profile };
}

function getPayload(formData: FormData): CampaignPayload {
  const companyId = String(formData.get("companyId") || "");
  const campaignName = String(formData.get("campaignName") || "").trim();
  const rateAmount = Number.parseFloat(String(formData.get("rateAmount") || "0"));
  const rateUnit = String(formData.get("rateUnit") || "").trim();
  const rateValue = Number.parseInt(String(formData.get("rateValue") || "0"), 10);
  const targetCity = String(formData.get("targetCities") || "Islamabad").trim();

  return {
    company_id: companyId,
    campaign_name: campaignName,
    status: String(formData.get("status") || "DRAFT").trim(),
    ad_format: String(formData.get("adFormat") || "").trim(),
    start_at: String(formData.get("startAt") || "").trim() || null,
    end_at: String(formData.get("endAt") || "").trim() || null,
    budget: Number.parseFloat(String(formData.get("budget") || "0")) || null,
    rate_amount: rateAmount,
    rate_unit: rateUnit,
    rate_value: rateValue,
    target_cities: targetCity ? [targetCity] : [],
    notes: String(formData.get("notes") || "").trim(),
  };
}

function getRedirectBase(role: string) {
  return role === "ADMIN" ? "/admin/campaigns" : "/dashboard/campaigns";
}

async function getCompanyName(supabase: Awaited<ReturnType<typeof createClient>>, companyId: string) {
  const { data: company } = await supabase
    .from("company_profiles")
    .select("company_name")
    .eq("user_id", companyId)
    .single();

  return company?.company_name || "Unassigned Company";
}

async function uploadCreativeFile(
  formData: FormData,
  companyName: string,
  existingFileId?: string | null,
) {
  const file = formData.get("creativeFile");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  const upload = await uploadCreativeToGoogleDrive(file, {
    companyName,
    existingFileId,
  });

  return upload;
}

export async function createCampaignAction(formData: FormData) {
  const { supabase, user, profile } = await getActor();
  const payload = getPayload(formData);

  if (!payload.company_id || !payload.campaign_name || !payload.rate_amount || !payload.rate_unit || !payload.rate_value) {
    redirect(`${getRedirectBase(profile.role)}/new?error=Company, campaign name, and rate details are required.`);
  }

  if (profile.role === "COMPANY") {
    payload.company_id = user.id;
  }

  if (!["ADMIN", "COMPANY"].includes(profile.role)) {
    redirect("/dashboard");
  }

  try {
    const companyName = await getCompanyName(supabase, payload.company_id);
    const creative = await uploadCreativeFile(formData, companyName);

    if (creative) {
      payload.creative_url = creative.url;
      payload.creative_file_id = creative.id;
    }
  } catch (error) {
    redirect(`${getRedirectBase(profile.role)}/new?error=${encodeURIComponent(error instanceof Error ? error.message : "Creative upload failed.")}`);
  }

  const { error } = await supabase.from("campaigns").insert(payload);

  if (error) {
    redirect(`${getRedirectBase(profile.role)}/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/dashboard/campaigns");
  revalidatePath("/admin/campaigns");
  redirect(
    profile.role === "ADMIN"
      ? "/admin?success=Campaign created successfully."
      : "/dashboard?success=Campaign created successfully.",
  );
}

export async function updateCampaignAction(campaignId: string, formData: FormData) {
  const { supabase, user, profile } = await getActor();
  const payload = getPayload(formData);

  if (!payload.company_id || !payload.campaign_name || !payload.rate_amount || !payload.rate_unit || !payload.rate_value) {
    redirect(`${getRedirectBase(profile.role)}/${campaignId}/edit?error=Company, campaign name, and rate details are required.`);
  }

  if (profile.role === "COMPANY") {
    payload.company_id = user.id;
  }

  if (!["ADMIN", "COMPANY"].includes(profile.role)) {
    redirect("/dashboard");
  }

  try {
    let existingCampaignQuery = supabase
      .from("campaigns")
      .select("creative_file_id")
      .eq("id", campaignId);

    if (profile.role === "COMPANY") {
      existingCampaignQuery = existingCampaignQuery.eq("company_id", user.id);
    }

    const [{ data: existingCampaign }, companyName] = await Promise.all([
      existingCampaignQuery.single(),
      getCompanyName(supabase, payload.company_id),
    ]);
    const creative = await uploadCreativeFile(
      formData,
      companyName,
      existingCampaign?.creative_file_id,
    );

    if (creative) {
      payload.creative_url = creative.url;
      payload.creative_file_id = creative.id;
    }
  } catch (error) {
    redirect(`${getRedirectBase(profile.role)}/${campaignId}/edit?error=${encodeURIComponent(error instanceof Error ? error.message : "Creative upload failed.")}`);
  }

  let query = supabase.from("campaigns").update(payload).eq("id", campaignId);

  if (profile.role === "COMPANY") {
    query = query.eq("company_id", user.id);
  }

  const { error } = await query;

  if (error) {
    redirect(`${getRedirectBase(profile.role)}/${campaignId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/dashboard/campaigns");
  revalidatePath("/admin/campaigns");
  redirect(
    profile.role === "ADMIN"
      ? "/admin?success=Campaign updated successfully."
      : "/dashboard?success=Campaign updated successfully.",
  );
}
