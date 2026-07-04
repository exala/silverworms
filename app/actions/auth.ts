"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function normalizePakistaniPhone(rawPhone: string) {
  const digits = rawPhone.replace(/\D/g, "");

  if (/^03\d{9}$/.test(digits)) {
    return `+92${digits.slice(1)}`;
  }

  if (/^3\d{9}$/.test(digits)) {
    return `+92${digits}`;
  }

  if (/^923\d{9}$/.test(digits)) {
    return `+${digits}`;
  }

  return null;
}

function getPakistaniPhoneSearchValues(rawPhone: string) {
  const digits = rawPhone.replace(/\D/g, "");
  const normalizedPhone = normalizePakistaniPhone(rawPhone);
  const values = new Set<string>();

  if (normalizedPhone) {
    values.add(normalizedPhone);
  }

  if (/^03\d{9}$/.test(digits)) {
    values.add(digits);
  }

  return Array.from(values);
}

async function profileExistsByEmail(email: string) {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    redirect(`/join-us/company?error=${encodeURIComponent(error.message)}`);
  }

  return Boolean(data);
}

async function profileExistsByPhone(phoneValues: string[]) {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .in("phone", phoneValues)
    .limit(1);

  if (error) {
    redirect(`/join-us/driver?error=${encodeURIComponent(error.message)}`);
  }

  return Boolean(data?.length);
}

export async function signInAction(formData: FormData) {
  const accountType = String(formData.get("accountType") || "EMAIL").trim().toUpperCase();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const rawPhone = String(formData.get("phone") || "").trim();
  const phone = accountType === "DRIVER" ? normalizePakistaniPhone(rawPhone) : rawPhone;
  const password = String(formData.get("password") || "").trim();
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  if (!password || (accountType === "DRIVER" ? !phone : !email)) {
    const message =
      accountType === "DRIVER"
        ? "Phone number and password are required."
        : "Email and password are required.";
    redirect(`/sign-in?error=${encodeURIComponent(message)}`);
  }

  if (accountType === "DRIVER" && !phone) {
    redirect(
      `/sign-in?error=${encodeURIComponent("Enter a valid Pakistani mobile number, for example 03013568887.")}`,
    );
  }

  const supabase = await createClient();
  const { error } =
    accountType === "DRIVER"
      ? await supabase.auth.signInWithPassword({ phone: phone as string, password })
      : await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, registration_completed")
      .eq("id", user.id)
      .single();

    if (profile?.role === "ADMIN") {
      redirect("/admin");
    }

    if (accountType === "DRIVER" && profile?.role !== "DRIVER") {
      await supabase.auth.signOut();
      redirect(`/sign-in?error=${encodeURIComponent("Please use the company/admin email sign-in form.")}`);
    }

    if (profile && !profile.registration_completed) {
      redirect("/complete-registration");
    }
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function sendJoinLinkAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const role = String(formData.get("role") || "").trim().toUpperCase();

  if (!email || !["DRIVER", "COMPANY"].includes(role)) {
    redirect("/join-us?error=Please choose a valid registration path.");
  }

  if (role === "COMPANY" && (await profileExistsByEmail(email))) {
    redirect(
      `/join-us/company?error=${encodeURIComponent("This email is already registered. Please sign in instead.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/complete-registration`,
      data: {
        pending_role: role,
      },
    },
  });

  if (error) {
    redirect(`/join-us/${role.toLowerCase()}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/check-email?email=${encodeURIComponent(email)}&role=${role.toLowerCase()}`,
  );
}

export async function resendMagicLinkAction(formData: FormData) {
  return sendJoinLinkAction(formData);
}

export async function sendDriverOtpAction(formData: FormData) {
  const rawPhone = String(formData.get("phone") || "").trim();
  const phone = normalizePakistaniPhone(rawPhone);

  if (!rawPhone) {
    redirect("/join-us/driver?error=Phone number is required.");
  }

  if (!phone) {
    redirect(
      `/join-us/driver?error=${encodeURIComponent("Enter a valid Pakistani mobile number, for example 03013568887.")}`,
    );
  }

  if (await profileExistsByPhone(getPakistaniPhoneSearchValues(rawPhone))) {
    redirect(
      `/join-us/driver?error=${encodeURIComponent("This phone number is already registered. Please sign in instead.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: "sms",
      shouldCreateUser: true,
      data: {
        pending_role: "DRIVER",
      },
    },
  });

  if (error) {
    redirect(`/join-us/driver?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/check-phone?phone=${encodeURIComponent(phone)}&expires=60`);
}

export async function verifyDriverOtpAction(formData: FormData) {
  const phone = String(formData.get("phone") || "").trim();
  const token = String(formData.get("token") || "").trim();

  if (!phone || !token) {
    redirect(`/check-phone?phone=${encodeURIComponent(phone)}&error=Phone number and OTP are required.`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    redirect(
      `/check-phone?phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect("/complete-registration");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
