import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import Image from "next/image";
import Logo from "../app/icon.png";
import { Archivo_Black } from "next/font/google";

const oswaldFont = Archivo_Black({
  subsets: ['latin'],
  weight: "400",
})

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-30 mx-auto mt-4 w-[min(1180px,calc(100%-1rem))] rounded-full border border-white/70 bg-white/80 px-5 py-4 shadow-float backdrop-blur-xl md:px-7 md:py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          className={`text-lg font-semibold tracking-[-0.04em] text-silver-800 md:text-xl ${oswaldFont.className}`}
          href="/"
        >
          <Image 
            src={Logo}
            alt=""
            width={50}
            height={50}
            className="inline"
          />
          SILVERWORMS
        </Link>
        <nav className="flex flex-wrap gap-2">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact Us" },
            { href: "/join-us", label: "Join Us" },
          ].map((item) => (
            <Link
              key={item.href}
              className="rounded-full px-5 py-3 text-sm font-medium text-silver-700 transition hover:bg-silver-100 hover:text-silver-900"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          {profile ? (
            <Link
              className="rounded-full bg-silver-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-silver-700"
              href={profile.role === "ADMIN" ? "/admin" : "/dashboard"}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              className="rounded-full bg-silver-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-silver-700"
              href="/sign-in"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
