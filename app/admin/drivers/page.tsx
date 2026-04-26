import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDriversPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: drivers } = await supabase
    .from("driver_profiles")
    .select(
      "user_id, ride_hailing_platform, car_make, car_model, car_year, plate_number, status, profiles!driver_profiles_user_id_fkey(email, full_name, phone, city)",
    )
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto mt-8 w-[min(1180px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-medium text-silver-600">
        <Link className="rounded-full border border-silver-200 bg-white px-4 py-2.5 transition hover:border-silver-300 hover:bg-silver-50 hover:text-silver-900" href="/admin">
          Admin Home
        </Link>
        <Link className="rounded-full border border-silver-200 bg-white px-4 py-2.5 transition hover:border-silver-300 hover:bg-silver-50 hover:text-silver-900" href="/">
          Home
        </Link>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">Drivers</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        Registered driver profiles and vehicles.
      </h1>
      <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-silver-200/80 bg-white/90 shadow-sm">
        {!drivers?.length ? (
          <p className="px-6 py-5 text-sm text-silver-500">No driver records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-silver-50 text-silver-500">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Name</th>
                  <th className="px-6 py-4 text-left font-medium">Email</th>
                  <th className="px-6 py-4 text-left font-medium">Phone</th>
                  <th className="px-6 py-4 text-left font-medium">Platform</th>
                  <th className="px-6 py-4 text-left font-medium">Vehicle</th>
                  <th className="px-6 py-4 text-left font-medium">City</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => {
                  const profile = Array.isArray(driver.profiles)
                    ? driver.profiles[0]
                    : driver.profiles;

                  return (
                    <tr key={driver.user_id} className="border-t border-silver-100">
                      <td className="px-6 py-4 text-silver-900">{profile?.full_name || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">{profile?.email || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">{profile?.phone || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">{driver.ride_hailing_platform || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">
                        {driver.car_make || "-"} {driver.car_model || ""} {driver.car_year || ""}
                        <br />
                        {driver.plate_number || "No plate"}
                      </td>
                      <td className="px-6 py-4 text-silver-600">{profile?.city || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">{driver.status || "Pending"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
