import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCompaniesPage(props: {
  searchParams: Promise<{
    company?: string;
    contact?: string;
    industry?: string;
    tax?: string;
    website?: string;
    status?: string;
  }>;
}) {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("company_profiles")
    .select(
      "user_id, company_name, contact_person, website, industry, ntn, fbr_registration, verification_status, profiles!company_profiles_user_id_fkey(email, phone, city)",
    )
    .order("created_at", { ascending: false });
  const filteredCompanies = (companies || []).filter((company) => {
    const profile = Array.isArray(company.profiles) ? company.profiles[0] : company.profiles;
    const contact = `${company.contact_person || ""} ${profile?.email || ""} ${profile?.phone || ""}`;
    const tax = `${company.ntn || ""} ${company.fbr_registration || ""}`;

    return [
      [company.company_name, searchParams.company],
      [contact, searchParams.contact],
      [company.industry, searchParams.industry],
      [tax, searchParams.tax],
      [company.website, searchParams.website],
      [company.verification_status, searchParams.status],
    ].every(([value, filter]) =>
      !filter || String(value || "").toLowerCase().includes(String(filter).toLowerCase()),
    );
  });

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
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">Companies</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        Companies ready for advertising campaigns.
      </h1>
      <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-silver-200/80 bg-white/90 shadow-sm">
        {!companies?.length ? (
          <p className="px-6 py-5 text-sm text-silver-500">No company records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <form id="company-filters">
              <button className="sr-only" type="submit">Apply filters</button>
            </form>
            <table className="min-w-full text-sm">
              <thead className="bg-silver-50 text-silver-500">
                <tr>
                  {[
                    ["Company", "company"],
                    ["Contact", "contact"],
                    ["Industry", "industry"],
                    ["NTN / FBR", "tax"],
                    ["Website", "website"],
                    ["Status", "status"],
                  ].map(([label, name]) => (
                    <th key={name} className="px-4 py-3 text-left font-medium">
                      <span>{label}</span>
                      <input
                        className="mt-2 min-w-32 rounded-xl px-3 py-2 text-xs"
                        defaultValue={searchParams[name as keyof typeof searchParams] || ""}
                        form="company-filters"
                        name={name}
                        placeholder="Filter"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => {
                  const profile = Array.isArray(company.profiles)
                    ? company.profiles[0]
                    : company.profiles;

                  return (
                    <tr key={company.user_id} className="border-t border-silver-100">
                      <td className="px-6 py-4 text-silver-900">{company.company_name || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">
                        {company.contact_person || "Not set"}
                        <br />
                        {profile?.email || "No email"}
                        <br />
                        {profile?.phone || "No phone"}
                      </td>
                      <td className="px-6 py-4 text-silver-600">{company.industry || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">
                        NTN: {company.ntn || "-"}
                        <br />
                        FBR: {company.fbr_registration || "-"}
                      </td>
                      <td className="px-6 py-4 text-silver-600">{company.website || "Not set"}</td>
                      <td className="px-6 py-4 text-silver-600">
                        {company.verification_status || "Pending"}
                      </td>
                    </tr>
                  );
                })}
                {!filteredCompanies.length ? (
                  <tr>
                    <td className="border-t border-silver-100 px-6 py-5 text-silver-500" colSpan={6}>
                      No companies match the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
