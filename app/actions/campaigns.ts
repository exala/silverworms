"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

function getPayload(formData: FormData) {
  const companyId = String(formData.get("companyId") || "");
  const campaignName = String(formData.get("campaignName") || "").trim();
  const rateAmount = Number.parseFloat(String(formData.get("rateAmount") || "0"));
  const rateUnit = String(formData.get("rateUnit") || "").trim();
  const rateValue = Number.parseInt(String(formData.get("rateValue") || "0"), 10);
  const targetCities = String(formData.get("targetCities") || "")
    .split(",")
    .map((city) => city.trim())
    .filter(Boolean);

  return {
    company_id: companyId,
    campaign_name: campaignName,
    status: String(formData.get("status") || "DRAFT").trim(),
    ad_format: String(formData.get("adFormat") || "").trim(),
    headline: String(formData.get("headline") || "").trim(),
    start_at: String(formData.get("startAt") || "").trim() || null,
    end_at: String(formData.get("endAt") || "").trim() || null,
    budget: Number.parseFloat(String(formData.get("budget") || "0")) || null,
    rate_amount: rateAmount,
    rate_unit: rateUnit,
    rate_value: rateValue,
    creative_url: String(formData.get("creativeUrl") || "").trim(),
    target_cities: targetCities,
    notes: String(formData.get("notes") || "").trim(),
  };
}

function getRedirectBase(role: string) {
  return role === "ADMIN" ? "/admin/campaigns" : "/dashboard/campaigns";
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
