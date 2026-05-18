import type { ReactNode } from "react";

type CompanyOption = {
  user_id: string;
  company_name: string | null;
};

type CampaignValues = {
  company_id?: string | null;
  campaign_name?: string | null;
  status?: string | null;
  ad_format?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  rate_amount?: number | null;
  rate_unit?: string | null;
  rate_value?: number | null;
  budget?: number | null;
  creative_url?: string | null;
  target_cities?: string[] | null;
  notes?: string | null;
};

const labelClass = "grid gap-2 text-sm font-semibold text-silver-700";

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}

export function CampaignForm({
  action,
  companies,
  companyId,
  companyLocked = false,
  companyLabel,
  error,
  submitLabel,
  title,
  intro,
  links,
  initialValues,
}: {
  action: (formData: FormData) => Promise<void>;
  companies: CompanyOption[];
  companyId?: string;
  companyLocked?: boolean;
  companyLabel?: string;
  error?: string;
  submitLabel: string;
  title: string;
  intro: string;
  links?: ReactNode;
  initialValues?: CampaignValues;
}) {
  const selectedCompanyId = companyId || initialValues?.company_id || "";

  return (
    <section className="mx-auto mt-8 w-[min(920px,calc(100%-2rem))] rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-haze backdrop-blur-xl md:p-8">
      {links ? <div className="mb-6">{links}</div> : null}
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-silver-500">
        Campaign
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-silver-900">
        {title}
      </h1>
      <p className="mt-4 text-base leading-8 text-silver-600">{intro}</p>
      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
      <form action={action} className="mt-6 space-y-5">
        {companyLocked ? (
          <>
            <input name="companyId" type="hidden" value={selectedCompanyId} />
            <label className={labelClass}>
              Company
              <input disabled value={companyLabel || "Your company"} />
            </label>
          </>
        ) : (
          <label className={labelClass}>
            Company
            <select defaultValue={selectedCompanyId} name="companyId" required>
              <option disabled value="">
                Select a company
              </option>
              {companies.map((company) => (
                <option key={company.user_id} value={company.user_id}>
                  {company.company_name || "Unnamed company"}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Campaign name
            <input defaultValue={initialValues?.campaign_name || ""} name="campaignName" required />
          </label>
          <label className={labelClass}>
            Campaign status
            <select defaultValue={initialValues?.status || "DRAFT"} name="status">
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="LIVE">Live</option>
              <option value="PAUSED">Paused</option>
            </select>
          </label>
        </div>
        <label className={labelClass}>
          Ad format
          <select defaultValue={initialValues?.ad_format || "STATIC"} name="adFormat">
            <option value="STATIC">Static image</option>
            <option value="VIDEO">Video loop</option>
            <option value="SLIDESHOW">Slideshow</option>
          </select>
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Start date and time
            <input
              defaultValue={toDateTimeLocal(initialValues?.start_at)}
              name="startAt"
              type="datetime-local"
            />
          </label>
          <label className={labelClass}>
            End date and time
            <input
              defaultValue={toDateTimeLocal(initialValues?.end_at)}
              name="endAt"
              type="datetime-local"
            />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <label className={labelClass}>
            Rate price
            <input
              defaultValue={initialValues?.rate_amount ?? ""}
              min="0"
              name="rateAmount"
              required
              step="0.01"
              type="number"
            />
          </label>
          <label className={labelClass}>
            Duration unit
            <select defaultValue={initialValues?.rate_unit || "hour"} name="rateUnit" required>
              <option value="minute">Minutes</option>
              <option value="hour">Hours</option>
              <option value="day">Days</option>
              <option value="week">Weeks</option>
            </select>
          </label>
          <label className={labelClass}>
            Duration value
            <input
              defaultValue={initialValues?.rate_value ?? 1}
              max="20"
              min="1"
              name="rateValue"
              required
              type="number"
            />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Total budget
            <input
              defaultValue={initialValues?.budget ?? ""}
              min="0"
              name="budget"
              step="0.01"
              type="number"
            />
          </label>
          <label className={labelClass}>
            Upload creative file
            <input
              accept="image/*,video/*,.pdf"
              name="creativeFile"
              type="file"
            />
            {initialValues?.creative_url ? (
              <a
                className="text-xs font-medium text-silver-600 underline-offset-4 hover:underline"
                href={initialValues.creative_url}
                rel="noreferrer"
                target="_blank"
              >
                Current creative file
              </a>
            ) : null}
          </label>
        </div>
        <label className={labelClass}>
          Target cities
          <select
            defaultValue={initialValues?.target_cities?.[0] || "Islamabad"}
            name="targetCities"
          >
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
          </select>
        </label>
        <label className={labelClass}>
          Notes
          <textarea
            defaultValue={initialValues?.notes || ""}
            name="notes"
            placeholder="Placement notes, audience notes, compliance remarks, display schedule..."
          />
        </label>
        <button
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-silver-900 px-7 py-4 text-sm font-semibold text-white shadow-float transition hover:bg-silver-700"
          type="submit"
        >
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
