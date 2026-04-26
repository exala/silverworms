import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

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
        return NextResponse.redirect(new URL("/admin", url.origin));
      }

      if (profile && !profile.registration_completed) {
        return NextResponse.redirect(new URL("/complete-registration", url.origin));
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
