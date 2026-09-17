"use client";

import { useActionState, useState } from "react";
import { submitPaymentSlipAction } from "@/lib/actions/payments";
import { SubmitButton } from "@/components/ui";

export function SlipForm({ paymentId, hasSlip }: { paymentId: number; hasSlip: boolean }) {
  const [state, formAction] = useActionState(submitPaymentSlipAction, null);
  const [open, setOpen] = useState(false);

  if (!open && !hasSlip) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-burgundy hover:underline"
      >
        แจ้งชำระเงิน / แนบสลิป
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="paymentId" value={paymentId} />
      {state?.error ? <p className="text-xs text-danger">{state.error}</p> : null}
      <div>
        <label className="block text-xs text-ink-soft mb-1">
          ลิงก์รูปสลิปโอนเงิน (เช่น ลิงก์ Google Drive)
        </label>
        <input
          name="slipUrl"
          required
          placeholder="https://..."
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      </div>
      <SubmitButton className="text-xs px-4 py-2" pendingText="กำลังส่ง…">
        {hasSlip ? "อัปเดตสลิป" : "ส่งสลิปให้ตรวจสอบ"}
      </SubmitButton>
    </form>
  );
}
