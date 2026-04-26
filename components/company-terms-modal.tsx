"use client";

import { useId, useState } from "react";

export function CompanyTermsModal() {
  const [open, setOpen] = useState(false);
  const checkboxId = useId();

  return (
    <>
      <div className="rounded-[1.6rem] border border-silver-200/80 bg-silver-50/70 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-silver-900">
              Content Upload Terms
            </h3>
            <p className="mt-1 text-sm leading-7 text-silver-600">
              Before creating a company account, review and accept SILVERWORMS&apos;
              video content upload rules and moderation policy.
            </p>
          </div>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-silver-200 bg-white px-5 py-3 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-silver-100"
            onClick={() => setOpen(true)}
            type="button"
          >
            Read terms
          </button>
        </div>
        <label
          className="mt-4 flex items-start gap-3 rounded-2xl border border-silver-200 bg-white px-4 py-3 text-sm text-silver-700"
          htmlFor={checkboxId}
        >
          <input
            className="mt-1 h-4 w-4 rounded border-silver-300 text-silver-900 focus:ring-silver-300"
            id={checkboxId}
            name="termsAccepted"
            required
            type="checkbox"
            value="accepted"
          />
          <span>
            I have read and agree to the SILVERWORMS content upload terms and
            responsibilities.
          </span>
        </label>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-silver-900/30 p-4 backdrop-blur-md">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-haze">
            <div className="flex items-center justify-between border-b border-silver-200 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-silver-500">
                  SILVERWORMS
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-silver-900">
                  Terms and Conditions for Content Uploads
                </h2>
              </div>
              <button
                className="rounded-full border border-silver-200 bg-white px-4 py-2 text-sm font-semibold text-silver-700 transition hover:bg-silver-100"
                onClick={() => setOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="max-h-[calc(85vh-96px)] space-y-6 overflow-y-auto px-6 py-6 text-sm leading-7 text-silver-700">
              <section>
                <h3 className="text-base font-semibold text-silver-900">
                  1. Content Guidelines
                </h3>
                <p className="mt-2">
                  You are solely responsible for all video content you upload,
                  publish, or display on or through the SILVERWORMS platform. You
                  affirm that you own or have the necessary licenses, rights,
                  consents, and permissions to publish the content you submit.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-silver-900">
                  2. Prohibited Content
                </h3>
                <p className="mt-2">
                  You explicitly agree that any video content you upload must not:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    Promote, advocate, or depict anti-state activities, terrorism,
                    or any form of political extremism.
                  </li>
                  <li>
                    Contain sexually explicit, obscene, or pornographic material,
                    or any content depicting nudity or sexual acts.
                  </li>
                  <li>
                    Be defamatory, libelous, or contain hate speech, or content
                    that incites violence or discrimination against any individual
                    or group based on race, religion, national origin, ethnicity,
                    skin color, disability, sex, gender identity, sexual
                    orientation, or age.
                  </li>
                  <li>
                    Infringe upon any third-party&apos;s intellectual property
                    rights, including copyright, trademark, privacy, or publicity
                    rights.
                  </li>
                  <li>
                    Violate any applicable local, national, or international law
                    or regulation.
                  </li>
                  <li>Depict graphic violence, gore, or animal cruelty.</li>
                  <li>
                    Promote illegal activities, including but not limited to drug
                    use, illegal gambling, or the sale of illegal firearms.
                  </li>
                  <li>Contain false, misleading, or deceptive information.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-silver-900">
                  3. Moderation and Enforcement
                </h3>
                <p className="mt-2">
                  SILVERWORMS reserves the right, but not the obligation, to
                  monitor, review, remove, or edit any content at its sole
                  discretion, without prior notice, if it violates these terms or
                  is otherwise objectionable. Repeated violations may lead to the
                  suspension or termination of your account.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-silver-900">
                  4. Indemnification
                </h3>
                <p className="mt-2">
                  You agree to indemnify and hold harmless SILVERWORMS and its
                  affiliates, officers, agents, and employees from any claim or
                  demand, including reasonable attorneys&apos; fees, made by any
                  third party due to or arising out of your breach of these Content
                  Guidelines.
                </p>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
