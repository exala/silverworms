"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type HeaderProfile = {
  email: string | null;
  full_name: string | null;
  role: "ADMIN" | "DRIVER" | "COMPANY";
};

export function HeaderAuthControls() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<HeaderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("email, full_name, role")
        .eq("id", user.id)
        .single();

      if (!active) {
        return;
      }

      setProfile(data as HeaderProfile | null);
      setLoading(false);
    }

    setLoading(true);
    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
      router.refresh();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  async function handleSignOut() {
    const supabase = createClient();

    await supabase.auth.signOut();
    setProfile(null);
    router.refresh();
    router.push("/");
  }

  if (loading) {
    return <span className="h-11 w-24 rounded-full bg-silver-100" aria-hidden="true" />;
  }

  if (!profile) {
    return (
      <Link
        className="rounded-full bg-silver-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-silver-700"
        href="/sign-in"
      >
        Sign In
      </Link>
    );
  }

  return (
    <>
      <Link
        className="rounded-full bg-silver-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-silver-700"
        href={profile.role === "ADMIN" ? "/admin" : "/dashboard"}
      >
        Dashboard
      </Link>
      <details className="group relative">
        <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full bg-silver-900 text-sm font-semibold uppercase text-white shadow-sm transition hover:bg-silver-700 [&::-webkit-details-marker]:hidden">
          {(profile.full_name || profile.email || "U").slice(0, 1)}
        </summary>
        <div className="absolute right-0 top-13 z-40 w-56 rounded-2xl border border-silver-200 bg-white p-3 text-sm shadow-float">
          <div className="border-b border-silver-100 px-2 pb-3">
            <p className="font-semibold text-silver-900">
              {profile.full_name || "SILVERWORMS user"}
            </p>
            <p className="mt-1 truncate text-xs text-silver-500">{profile.email}</p>
          </div>
          <button
            className="mt-3 w-full rounded-xl px-3 py-2 text-left font-medium text-silver-700 transition hover:bg-silver-100 hover:text-silver-900"
            onClick={handleSignOut}
            type="button"
          >
            Sign out
          </button>
        </div>
      </details>
    </>
  );
}
