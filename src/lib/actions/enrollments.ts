"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireSession, requireAdmin } from "@/lib/auth";
import type { ActionState } from "./auth";

function generateInvoiceNo() {
  const now = new Date();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${now.getFullYear() + 543}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${rand}`;
}

const bookSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  scheduleId: z.coerce.number().int().positive().optional(),
  note: z.string().optional(),
});

export async function createEnrollmentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();

  const parsed = bookSchema.safeParse({
    courseId: formData.get("courseId"),
    scheduleId: formData.get("scheduleId") || undefined,
    note: formData.get("note") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const course = await db.query.courses.findFirst({
    where: eq(schema.courses.id, parsed.data.courseId),
  });
  if (!course) return { error: "ไม่พบคอร์สที่เลือก" };

  const [enrollment] = await db
    .insert(schema.enrollments)
    .values({
      userId: session.userId,
      courseId: parsed.data.courseId,
      scheduleId: parsed.data.scheduleId ?? null,
      status: "pending",
      note: parsed.data.note ?? "",
    })
    .returning();

  await db.insert(schema.payments).values({
    userId: session.userId,
    enrollmentId: enrollment.id,
    invoiceNo: generateInvoiceNo(),
    amount: course.price,
    method: "bank_transfer",
    status: "pending",
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/payments");
  revalidatePath("/admin/bookings");
  redirect("/dashboard/bookings?booked=1");
}

export async function cancelEnrollmentAction(formData: FormData) {
  const session = await requireSession();
  const id = Number(formData.get("id"));

  const enrollment = await db.query.enrollments.findFirst({
    where: eq(schema.enrollments.id, id),
  });
  if (!enrollment || enrollment.userId !== session.userId) return;

  await db
    .update(schema.enrollments)
    .set({ status: "cancelled" })
    .where(eq(schema.enrollments.id, id));

  revalidatePath("/dashboard/bookings");
  revalidatePath("/admin/bookings");
}

const statusSchema = z.enum(["pending", "confirmed", "cancelled", "completed"]);

export async function updateEnrollmentStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) return;

  await db
    .update(schema.enrollments)
    .set({ status: parsed.data })
    .where(eq(schema.enrollments.id, id));

  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard/bookings");
}
