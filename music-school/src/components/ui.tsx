"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";

export function SubmitButton({
  children,
  className,
  pendingText = "กำลังบันทึก…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(
        "rounded-full bg-burgundy text-ivory px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-brass-soft text-ink-soft",
  confirmed: "bg-sage/15 text-sage",
  paid: "bg-sage/15 text-sage",
  cancelled: "bg-danger/10 text-danger",
  failed: "bg-danger/10 text-danger",
  refunded: "bg-line text-ink-soft",
  completed: "bg-burgundy/10 text-burgundy",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-line text-ink-soft"
      )}
    >
      {label}
    </span>
  );
}
