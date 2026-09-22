"use client";

import { useRef, useTransition } from "react";

export function StatusSelectForm({
  action,
  id,
  currentStatus,
  options,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: number;
  currentStatus: string;
  options: { value: string; label: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={action}
      className="inline-block"
    >
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={currentStatus}
        disabled={isPending}
        onChange={() => {
          startTransition(() => {
            formRef.current?.requestSubmit();
          });
        }}
        className="text-xs rounded-full border border-line bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy disabled:opacity-60"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  );
}
