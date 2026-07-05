"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { resendDriverOtpAction } from "@/app/actions/auth";

function ResendButton({ secondsLeft }: { secondsLeft: number }) {
  const { pending } = useFormStatus();
  const disabled = pending || secondsLeft > 0;

  return (
    <button
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-silver-200 bg-white px-5 py-3 text-sm font-semibold text-silver-800 transition hover:border-silver-300 hover:bg-silver-50 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      type="submit"
    >
      {pending ? "Resending..." : secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend code"}
    </button>
  );
}

export function CheckPhoneResend({ phone, initialSeconds = 60 }: { phone: string; initialSeconds?: number }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <form action={resendDriverOtpAction} className="mt-4 flex flex-wrap items-center gap-3">
      <input name="phone" type="hidden" value={phone} />
      <ResendButton secondsLeft={secondsLeft} />
      <p className="text-sm text-silver-500" aria-live="polite">
        {secondsLeft > 0
          ? `You can request a new code after ${secondsLeft} seconds.`
          : "You can request a new code now."}
      </p>
    </form>
  );
}
