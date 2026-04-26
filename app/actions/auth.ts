"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  if (!email || !password) {
    redirect(`/sign-in?error=${encodeURIComponent("Email and password are required.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

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
  const email = String(formData.get("email") || "").trim();
  const role = String(formData.get("role") || "").trim().toUpperCase();

  if (!email || !["DRIVER", "COMPANY"].includes(role)) {
    redirect("/join-us?error=Please choose a valid registration path.");
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

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
