"use client";

import { useFormStatus } from "react-dom";

export function FormPendingOverlay({ label }: { label: string }) {
  const { pending } = useFormStatus();

  if (!pending) {
    return null;
  }

  return (
    <div
      aria-label={label}
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-silver-100/45 backdrop-blur-md"
      role="status"
    >
      <div className="grid min-w-[240px] justify-items-center gap-4 rounded-[2rem] border border-white/80 bg-white/90 px-8 py-7 shadow-haze">
        <span className="h-11 w-11 animate-spin rounded-full border-4 border-silver-200 border-t-silver-500" />
        <p className="text-sm font-medium text-silver-700">{label}</p>
      </div>
    </div>
  );
}

export function PendingSubmitButton({
  idleLabel,
  pendingLabel,
  className,
}: {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={
        className ||
        "inline-flex min-h-14 items-center justify-center rounded-full bg-silver-900 px-7 py-4 text-sm font-semibold text-white shadow-float transition hover:bg-silver-700 disabled:cursor-not-allowed disabled:opacity-70"
      }
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
