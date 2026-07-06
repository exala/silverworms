"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { User } from "@supabase/supabase-js";
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
    values.add(normalizedPhone.replace(/\D/g, ""));

    const normalizedDigits = normalizedPhone.replace(/\D/g, "");

    if (/^923\d{9}$/.test(normalizedDigits)) {
      values.add(`0${normalizedDigits.slice(2)}`);
    }
  }

  if (/^03\d{9}$/.test(digits)) {
    values.add(digits);
  }

  if (/^923\d{9}$/.test(digits)) {
    values.add(digits);
    values.add(`+${digits}`);
    values.add(`0${digits.slice(2)}`);
  }

  if (/^3\d{9}$/.test(digits)) {
    values.add(digits);
    values.add(`+92${digits}`);
    values.add(`92${digits}`);
    values.add(`0${digits}`);
  }

  return Array.from(values);
}

async function getProfileByEmail(email: string) {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role, registration_completed")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    redirect(`/join-us/company?error=${encodeURIComponent(error.message)}`);
  }

  return data;
}

async function getProfileByPhone(phoneValues: string[]) {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role, registration_completed")
    .in("phone", phoneValues)
    .limit(1);

  if (error) {
    redirect(`/join-us/driver?error=${encodeURIComponent(error.message)}`);
  }

  return data?.[0] || null;
}

async function getDriverRegistrationByPhone(phoneValues: string[]) {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .rpc("find_driver_registration_by_phone", { phone_values: phoneValues })
    .maybeSingle();

  if (error) {
    redirect(
      `/join-us/driver?error=${encodeURIComponent("Phone registration check is not configured. Please run the latest Supabase schema migration before sending OTP.")}`,
    );
  }

  return data as null | {
    user_id: string;
    registration_completed: boolean;
    source: string;
  };
}

async function getProfileByUserId(userId: string) {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role, registration_completed")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    redirect(`/join-us/driver?error=${encodeURIComponent(error.message)}`);
  }

  return data;
}

async function getAuthUserByPhone(phoneValues: string[]) {
  const supabaseAdmin = createAdminClient();
  let page = 1;
  const comparablePhoneValues = new Set(
    phoneValues.flatMap((value) => getPakistaniPhoneSearchValues(value)),
  );

  while (page <= 10) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      redirect(`/join-us/driver?error=${encodeURIComponent(error.message)}`);
    }

    const user = data.users.find((candidate) => {
      const candidateValues = getPakistaniPhoneSearchValues(candidate.phone || "");
      return candidateValues.some((value) => comparablePhoneValues.has(value));
    });

    if (user) {
      return user;
    }

    if (data.users.length < 1000) {
      return null;
    }

    page += 1;
  }

  return null;
}

async function ensurePendingDriverProfile(user: User, phone: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("profiles").upsert({
    id: user.id,
    email: user.email || null,
    phone: user.phone || phone,
    role: "DRIVER",
    registration_completed: false,
  });

  if (error) {
    redirect(`/join-us/driver?error=${encodeURIComponent(error.message)}`);
  }
}

async function sendDriverPhoneOtp({
  phone,
  shouldCreateUser,
}: {
  phone: string;
  shouldCreateUser: boolean;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: "sms",
      shouldCreateUser,
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

async function sendCompanyEmailOtp({
  email,
  shouldCreateUser,
}: {
  email: string;
  shouldCreateUser: boolean;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser,
      data: {
        pending_role: "COMPANY",
      },
    },
  });

  if (error) {
    redirect(`/join-us/company?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}&role=company&expires=60`);
}

export async function signInAction(formData: FormData) {
  const identifier = String(formData.get("identifier") || "").trim();
  const isEmail = identifier.includes("@");
  const email = isEmail ? identifier.toLowerCase() : "";
  const phone = isEmail ? null : normalizePakistaniPhone(identifier);
  const password = String(formData.get("password") || "").trim();
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  if (!identifier || !password) {
    redirect(
      `/sign-in?error=${encodeURIComponent("Email or phone number and password are required.")}`,
    );
  }

  if (!isEmail && !phone) {
    redirect(
      `/sign-in?error=${encodeURIComponent("Enter a valid email or Pakistani mobile number, for example 03013568887.")}`,
    );
  }

  const supabase = await createClient();
  const { error } =
    isEmail
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signInWithPassword({ phone: phone as string, password });

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

    if (profile && !profile.registration_completed) {
      redirect("/complete-registration");
    }
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function sendJoinLinkAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "").trim().toUpperCase();

  if (!email || !["DRIVER", "COMPANY"].includes(role)) {
    redirect("/join-us?error=Please choose a valid registration path.");
  }

  if (role === "COMPANY") {
    const existingProfile = await getProfileByEmail(email);

    if (existingProfile?.registration_completed) {
      redirect(
        `/join-us/company?error=${encodeURIComponent("This email is already registered. Please sign in instead.")}`,
      );
    }

    if (existingProfile && !existingProfile.registration_completed) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id === existingProfile.id) {
        redirect("/complete-registration");
      }

      await sendCompanyEmailOtp({ email, shouldCreateUser: false });
    }

    await sendCompanyEmailOtp({ email, shouldCreateUser: true });
  }

  redirect("/join-us?error=Please choose a valid registration path.");
}

export async function resendMagicLinkAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email) {
    redirect("/join-us/company?error=Email is required.");
  }

  const existingProfile = await getProfileByEmail(email);

  if (existingProfile?.registration_completed) {
    redirect(
      `/join-us/company?error=${encodeURIComponent("This email is already registered. Please sign in instead.")}`,
    );
  }

  await sendCompanyEmailOtp({ email, shouldCreateUser: false });
}

export async function verifyCompanyEmailOtpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const token = String(formData.get("token") || "").trim();

  if (!email || !token) {
    redirect(`/check-email?email=${encodeURIComponent(email)}&role=company&error=Email and OTP are required.`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    redirect(
      `/check-email?email=${encodeURIComponent(email)}&role=company&error=${encodeURIComponent(error.message)}`,
    );
  }

  if (data.user) {
    const supabaseAdmin = createAdminClient();
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email || email,
      phone: data.user.phone || null,
      role: "COMPANY",
      registration_completed: false,
    });

    if (profileError) {
      redirect(
        `/check-email?email=${encodeURIComponent(email)}&role=company&error=${encodeURIComponent(profileError.message)}`,
      );
    }
  }

  redirect("/complete-registration");
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

  const phoneValues = getPakistaniPhoneSearchValues(rawPhone);
  const existingRegistration = await getDriverRegistrationByPhone(phoneValues);

  if (existingRegistration?.registration_completed) {
    redirect(
      `/join-us/driver?error=${encodeURIComponent("This phone number is already registered. Please sign in instead.")}`,
    );
  }

  if (existingRegistration && !existingRegistration.registration_completed) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id === existingRegistration.user_id) {
      redirect("/complete-registration");
    }

    await sendDriverPhoneOtp({ phone, shouldCreateUser: false });
  }

  const existingProfile = await getProfileByPhone(phoneValues);

  if (existingProfile?.registration_completed) {
    redirect(
      `/join-us/driver?error=${encodeURIComponent("This phone number is already registered. Please sign in instead.")}`,
    );
  }

  if (existingProfile && !existingProfile.registration_completed) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id === existingProfile.id) {
      redirect("/complete-registration");
    }

    await sendDriverPhoneOtp({ phone, shouldCreateUser: false });
  }

  const existingAuthUser = await getAuthUserByPhone(getPakistaniPhoneSearchValues(rawPhone));

  if (existingAuthUser) {
    const profileByAuthUser = await getProfileByUserId(existingAuthUser.id);

    if (profileByAuthUser?.registration_completed) {
      redirect(
        `/join-us/driver?error=${encodeURIComponent("This phone number is already registered. Please sign in instead.")}`,
      );
    }

    await ensurePendingDriverProfile(existingAuthUser, phone);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id === existingAuthUser.id) {
      redirect("/complete-registration");
    }

    await sendDriverPhoneOtp({ phone, shouldCreateUser: false });
  }

  await sendDriverPhoneOtp({ phone, shouldCreateUser: true });
}

export async function resendDriverOtpAction(formData: FormData) {
  const rawPhone = String(formData.get("phone") || "").trim();
  const phone = normalizePakistaniPhone(rawPhone) || rawPhone;

  if (!phone) {
    redirect("/join-us/driver?error=Phone number is required.");
  }

  const existingRegistration = await getDriverRegistrationByPhone(
    getPakistaniPhoneSearchValues(phone),
  );

  if (existingRegistration?.registration_completed) {
    redirect(
      `/join-us/driver?error=${encodeURIComponent("This phone number is already registered. Please sign in instead.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: "sms",
      shouldCreateUser: false,
    },
  });

  if (error) {
    redirect(`/check-phone?phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/check-phone?phone=${encodeURIComponent(phone)}&resent=1&expires=60`);
}

export async function verifyDriverOtpAction(formData: FormData) {
  const phone = String(formData.get("phone") || "").trim();
  const token = String(formData.get("token") || "").trim();

  if (!phone || !token) {
    redirect(`/check-phone?phone=${encodeURIComponent(phone)}&error=Phone number and OTP are required.`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    redirect(
      `/check-phone?phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(error.message)}`,
    );
  }

  if (data.user) {
    const supabaseAdmin = createAdminClient();
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email || null,
      phone: data.user.phone || phone,
      role: "DRIVER",
      registration_completed: false,
    });

    if (profileError) {
      redirect(
        `/check-phone?phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(profileError.message)}`,
      );
    }
  }

  redirect("/complete-registration");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
