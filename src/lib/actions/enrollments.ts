
"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { requireSession, requireAdmin } from "@/lib/auth";
import type { ActionState } from "./auth";

// ========================================
// Validation
// ========================================

const bookSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  scheduleId: z.coerce.number().int().positive(),
  note: z.string().max(1000).optional(),
});

const statusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

// ========================================
// CREATE ENROLLMENT
// ========================================

export async function createEnrollmentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // ตรวจสอบการเข้าสู่ระบบ
  const session = await requireSession();

  // ตรวจสอบข้อมูลจากฟอร์ม
  const parsed = bookSchema.safeParse({
    courseId: formData.get("courseId"),
    scheduleId: formData.get("scheduleId"),
    note: formData.get("note") || "",
  });

  if (!parsed.success) {
    return {
      error: "กรุณาเลือกคอร์สและตารางเรียนให้ถูกต้อง",
    };
  }

  const { courseId, scheduleId, note } = parsed.data;

  // ตรวจสอบ Environment Variable
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL is missing");

    return {
      error: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้",
    };
  }

  // เชื่อมต่อ Neon
  const sql = neon(databaseUrl);

  let result: string;

  try {
    // ให้ PostgreSQL ตรวจสอบและจองแบบ Atomic
    const rows = await sql`
      SELECT book_course_atomic(
        ${session.userId},
        ${courseId},
        ${scheduleId},
        ${note ?? ""}
      ) AS result
    `;

    result = String(rows[0]?.result ?? "");

  } catch (error) {
    console.error("Create enrollment error:", error);

    return {
      error: "เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง",
    };
  }

  // จัดการผลลัพธ์จาก PostgreSQL
  switch (result) {
    case "INVALID_INPUT":
      return {
        error: "ข้อมูลการจองไม่ถูกต้อง",
      };

    case "COURSE_NOT_FOUND":
      return {
        error: "ไม่พบคอร์ส หรือคอร์สปิดรับสมัครแล้ว",
      };

    case "INVALID_SCHEDULE":
      return {
        error: "ตารางเรียนไม่ถูกต้อง กรุณาเลือกรอบใหม่",
      };

    case "ALREADY_ENROLLED":
      return {
        error: "คุณลงทะเบียนคอร์สนี้ไปแล้ว ไม่สามารถจองซ้ำได้",
      };

    case "SCHEDULE_FULL":
      return {
        error: "ตารางเรียนนี้เต็มแล้ว กรุณาเลือกรอบอื่น",
      };

    case "SUCCESS":
      break;

    default:
      console.error("Unknown booking result:", result);

      return {
        error: "ไม่สามารถดำเนินการจองได้",
      };
  }

  // อัปเดตข้อมูลหน้าเว็บไซต์
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/payments");
  revalidatePath("/admin/bookings");

  // ไปหน้ารายการจอง
  redirect("/dashboard/bookings?booked=1");
}

// ========================================
// CANCEL ENROLLMENT
// ========================================

export async function cancelEnrollmentAction(
  formData: FormData
) {
  const session = await requireSession();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return;
  }

  // ค้นหารายการจอง
  const enrollment =
    await db.query.enrollments.findFirst({
      where: eq(schema.enrollments.id, id),
    });

  if (!enrollment) {
    return;
  }

  // นักเรียนยกเลิกได้เฉพาะรายการของตัวเอง
  if (enrollment.userId !== session.userId) {
    return;
  }

  // ไม่ให้ยกเลิกรายการที่จบแล้ว
  if (
    enrollment.status === "cancelled" ||
    enrollment.status === "completed"
  ) {
    return;
  }

  // เปลี่ยนสถานะเป็น cancelled
  await db
    .update(schema.enrollments)
    .set({
      status: "cancelled",
    })
    .where(eq(schema.enrollments.id, id));

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/payments");
  revalidatePath("/admin/bookings");
}

// ========================================
// UPDATE ENROLLMENT STATUS (ADMIN)
// ========================================

export async function updateEnrollmentStatusAction(
  formData: FormData
) {
  // เฉพาะ Admin
  await requireAdmin();

  const id = Number(formData.get("id"));

  const parsed = statusSchema.safeParse(
    formData.get("status")
  );

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    !parsed.success
  ) {
    return;
  }

  const enrollment =
    await db.query.enrollments.findFirst({
      where: eq(schema.enrollments.id, id),
    });

  if (!enrollment) {
    return;
  }

  // ป้องกันการเปิดรายการที่ยกเลิก/จบแล้ว
  // จนกว่าจะเพิ่มการตรวจสอบที่นั่งฝั่ง Admin
  if (
    (enrollment.status === "cancelled" ||
      enrollment.status === "completed") &&
    (parsed.data === "pending" ||
      parsed.data === "confirmed")
  ) {
    return;
  }

  await db
    .update(schema.enrollments)
    .set({
      status: parsed.data,
    })
    .where(eq(schema.enrollments.id, id));

  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/payments");
}
