"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function parseIntOrNull(value: FormDataEntryValue | null) {
  if (!value) return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseFloatOrNull(value: FormDataEntryValue | null) {
  if (!value) return null;
  const parsed = Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? null : parsed;
}

export async function completeRegistrationAction(formData: FormData) {
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
    redirect("/sign-in?error=Profile not found.");
  }

  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!password || password.length < 8) {
    redirect("/complete-registration?error=Password must be at least 8 characters.");
  }

  if (password !== confirmPassword) {
    redirect("/complete-registration?error=Passwords do not match.");
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const phoneFromForm = String(formData.get("phone") || "").trim();
  const phone = profile.role === "DRIVER" ? phoneFromForm || user.phone || "" : phoneFromForm;
  const city = String(formData.get("city") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const termsAccepted = String(formData.get("termsAccepted") || "").trim();

  const { error: passwordError } = await supabase.auth.updateUser({ password });

  if (passwordError) {
    redirect(`/complete-registration?error=${encodeURIComponent(passwordError.message)}`);
  }

  if (profile.role === "DRIVER") {
    const { error } = await supabase.from("driver_profiles").upsert({
      user_id: user.id,
      cnic: String(formData.get("cnic") || "").trim(),
      license_number: String(formData.get("licenseNumber") || "").trim(),
      ride_hailing_platform: String(formData.get("ridePlatform") || "").trim(),
      car_make: String(formData.get("carMake") || "").trim(),
      car_model: String(formData.get("carModel") || "").trim(),
      car_year: parseIntOrNull(formData.get("carYear")),
      plate_number: String(formData.get("plateNumber") || "").trim(),
      led_screen_serial: String(formData.get("ledScreenSerial") || "").trim(),
      city,
      status: "ACTIVE",
    });

    if (error) {
      redirect(`/complete-registration?error=${encodeURIComponent(error.message)}`);
    }
  }

  if (profile.role === "COMPANY") {
    if (termsAccepted !== "accepted") {
      redirect("/complete-registration?error=Please accept the content upload terms to continue.");
    }

    const { error } = await supabase.from("company_profiles").upsert({
      user_id: user.id,
      company_name: String(formData.get("companyName") || "").trim(),
      contact_person: String(formData.get("contactPerson") || "").trim(),
      phone,
      website: String(formData.get("website") || "").trim(),
      industry: String(formData.get("industry") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      country,
      tax_identifier: String(formData.get("taxIdentifier") || "").trim(),
      ntn: String(formData.get("ntn") || "").trim(),
      fbr_registration: String(formData.get("fbrRegistration") || "").trim(),
      marketing_budget: parseFloatOrNull(formData.get("marketingBudget")),
      verification_status: "VERIFIED",
    });

    if (error) {
      redirect(`/complete-registration?error=${encodeURIComponent(error.message)}`);
    }
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      city,
      country,
      registration_completed: true,
    })
    .eq("id", user.id);

  if (profileError) {
    redirect(`/complete-registration?error=${encodeURIComponent(profileError.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard?success=Registration completed successfully.");
}
