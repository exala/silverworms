import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILVERWORMS",
  description:
    "Role-based vehicle advertising platform for ride-hailing drivers, brands, and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen">
          <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_62%)]" />
          <SiteHeader />
          <main className="pb-8">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
