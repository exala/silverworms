import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedPrefixes = ["/dashboard", "/admin", "/complete-registration"];
const guestOnlyPrefixes = ["/sign-in", "/sign-up", "/join-us", "/check-email", "/check-phone"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof response.cookies.set>[2];
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) => path.startsWith(prefix));
  const guestOnly = guestOnlyPrefixes.some((prefix) => path.startsWith(prefix));

  if (user && guestOnly) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, registration_completed")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();

    if (profile && !profile.registration_completed) {
      url.pathname = "/complete-registration";
      return NextResponse.redirect(url);
    }

    if (profile?.role === "ADMIN") {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (!needsAuth) {
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, registration_completed")
      .eq("id", user.id)
      .single();

    if (!profile) {
      const url = request.nextUrl.clone();
      url.pathname = "/complete-registration";
      return NextResponse.redirect(url);
    }

    if (profile.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("registration_completed")
      .eq("id", user.id)
      .single();

    if (profile && !profile.registration_completed) {
      const url = request.nextUrl.clone();
      url.pathname = "/complete-registration";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/complete-registration",
    "/sign-in",
    "/sign-up",
    "/join-us/:path*",
    "/check-email",
    "/check-phone",
  ],
};
