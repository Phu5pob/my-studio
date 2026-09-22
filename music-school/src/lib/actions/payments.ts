"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireSession, requireAdmin } from "@/lib/auth";
import type { ActionState } from "./auth";

// นักเรียนแจ้งชำระเงิน (แนบสลิป) — สถานะยังคงเป็น pending รอแอดมินตรวจสอบ
const submitSlipSchema = z.object({
  paymentId: z.coerce.number().int().positive(),
  slipUrl: z.string().min(1, "กรุณาระบุลิงก์สลิปโอนเงิน"),
});

export async function submitPaymentSlipAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = submitSlipSchema.safeParse({
    paymentId: formData.get("paymentId"),
    slipUrl: formData.get("slipUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const payment = await db.query.payments.findFirst({
    where: eq(schema.payments.id, parsed.data.paymentId),
  });
  if (!payment || payment.userId !== session.userId) {
    return { error: "ไม่พบรายการชำระเงินนี้" };
  }

  await db
    .update(schema.payments)
    .set({ slipUrl: parsed.data.slipUrl })
    .where(eq(schema.payments.id, payment.id));

  revalidatePath("/dashboard/payments");
  revalidatePath("/admin/payments");
  return { error: undefined };
}

const statusSchema = z.enum(["pending", "paid", "failed", "refunded"]);

export async function updatePaymentStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) return;

  await db
    .update(schema.payments)
    .set({
      status: parsed.data,
      paidAt: parsed.data === "paid" ? new Date() : null,
    })
    .where(eq(schema.payments.id, id));

  // เมื่อชำระเงินสำเร็จ ให้ยืนยันการลงทะเบียนคอร์สโดยอัตโนมัติ
  if (parsed.data === "paid") {
    const payment = await db.query.payments.findFirst({
      where: eq(schema.payments.id, id),
    });
    if (payment?.enrollmentId) {
      await db
        .update(schema.enrollments)
        .set({ status: "confirmed" })
        .where(eq(schema.enrollments.id, payment.enrollmentId));
    }
  }

  revalidatePath("/admin/payments");
  revalidatePath("/dashboard/payments");
  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard/bookings");
}
