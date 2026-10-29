
"use server";

import { z } from "zod";
import { eq, and, inArray, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./auth";

// ========================================
// Utilities
// ========================================

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9ก-๙\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || `course-${Date.now()}`
  );
}

function revalidateCoursePages() {
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/courses/[slug]", "page");
}

// ========================================
// Course Schema
// ========================================

const courseSchema = z.object({
  branchId: z.coerce.number().int().positive("กรุณาเลือกสาขา"),
  title: z.string().min(2, "กรุณากรอกชื่อคอร์ส"),
  instrument: z.string().min(1, "กรุณากรอกเครื่องดนตรี"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  durationWeeks: z.coerce.number().int().min(1),
  imageUrl: z.string().optional(),
});

function parseCourseForm(formData: FormData) {
  return courseSchema.safeParse({
    branchId: formData.get("branchId"),
    title: formData.get("title"),
    instrument: formData.get("instrument"),
    level: formData.get("level"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    durationWeeks: formData.get("durationWeeks"),
    imageUrl: formData.get("imageUrl") || "",
  });
}

// ========================================
// Create Course
// ========================================

export async function createCourseAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseCourseForm(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
    };
  }

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let counter = 1;

  while (
    await db.query.courses.findFirst({
      where: eq(schema.courses.slug, slug),
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  await db.insert(schema.courses).values({
    ...parsed.data,
    slug,
  });

  revalidateCoursePages();
  return null;
}

// ========================================
// Update Course
// ========================================

export async function updateCourseAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "รหัสคอร์สไม่ถูกต้อง" };
  }

  const parsed = parseCourseForm(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
    };
  }

  const existing = await db.query.courses.findFirst({
    where: eq(schema.courses.id, id),
  });

  if (!existing) {
    return { error: "ไม่พบคอร์สที่ต้องการแก้ไข" };
  }

  await db
    .update(schema.courses)
    .set(parsed.data)
    .where(eq(schema.courses.id, id));

  revalidateCoursePages();
  return null;
}

// ========================================
// Toggle Course Status
// ========================================

export async function toggleCourseActiveAction(
  formData: FormData
) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return;
  }

  const existing = await db.query.courses.findFirst({
    where: eq(schema.courses.id, id),
  });

  if (!existing) return;

  await db
    .update(schema.courses)
    .set({ isActive: !existing.isActive })
    .where(eq(schema.courses.id, id));

  revalidateCoursePages();
}

// ========================================
// Delete Course
// ========================================

export async function deleteCourseAction(
  formData: FormData
) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return;
  }

  await db
    .delete(schema.courses)
    .where(eq(schema.courses.id, id));

  revalidateCoursePages();
}

// ========================================
// Schedule Schema
// ========================================

const scheduleSchema = z
  .object({
    courseId: z.coerce.number().int().positive(),
    teacherId: z.coerce.number().int().positive().optional(),
    roomId: z.coerce.number().int().positive().optional(),
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: z.string().min(1, "กรุณาระบุเวลาเริ่ม"),
    endTime: z.string().min(1, "กรุณาระบุเวลาสิ้นสุด"),
    maxStudents: z.coerce.number().int().min(1),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม",
    path: ["endTime"],
  });

function parseScheduleForm(formData: FormData) {
  return scheduleSchema.safeParse({
    courseId: formData.get("courseId"),
    teacherId: formData.get("teacherId") || undefined,
    roomId: formData.get("roomId") || undefined,
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    maxStudents: formData.get("maxStudents"),
  });
}

// ========================================
// Create Schedule
// ========================================

export async function createScheduleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseScheduleForm(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
    };
  }

  const course = await db.query.courses.findFirst({
    where: eq(schema.courses.id, parsed.data.courseId),
  });

  if (!course) {
    return { error: "ไม่พบคอร์สเรียน" };
  }

  await db.insert(schema.schedules).values({
    courseId: parsed.data.courseId,
    teacherId: parsed.data.teacherId ?? null,
    roomId: parsed.data.roomId ?? null,
    dayOfWeek: parsed.data.dayOfWeek,
    startTime: parsed.data.startTime,
    endTime: parsed.data.endTime,
    maxStudents: parsed.data.maxStudents,
  });

  revalidateCoursePages();
  return null;
}

// ========================================
// Update Schedule
// ========================================

export async function updateScheduleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "รหัสรอบเรียนไม่ถูกต้อง" };
  }

  const parsed = parseScheduleForm(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
    };
  }

  const existing = await db.query.schedules.findFirst({
    where: eq(schema.schedules.id, id),
  });

  if (!existing || existing.courseId !== parsed.data.courseId) {
    return { error: "ไม่พบรอบเรียนที่ต้องการแก้ไข" };
  }

  // นับเฉพาะผู้จองที่ยังใช้ที่นั่ง
  const [bookingCount] = await db
    .select({ total: count() })
    .from(schema.enrollments)
    .where(
      and(
        eq(schema.enrollments.scheduleId, id),
        inArray(schema.enrollments.status, [
          "pending",
          "confirmed",
        ])
      )
    );

  const activeBookings = bookingCount?.total ?? 0;

  // ไม่อนุญาตให้ลดความจุต่ำกว่าจำนวนผู้จอง
  if (parsed.data.maxStudents < activeBookings) {
    return {
      error:
        `ไม่สามารถลดจำนวนรับสูงสุดเหลือ ` +
        `${parsed.data.maxStudents} คนได้ ` +
        `เนื่องจากมีผู้จองอยู่ ${activeBookings} คน`,
    };
  }

  await db
    .update(schema.schedules)
    .set({
      teacherId: parsed.data.teacherId ?? null,
      roomId: parsed.data.roomId ?? null,
      dayOfWeek: parsed.data.dayOfWeek,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      maxStudents: parsed.data.maxStudents,
    })
    .where(eq(schema.schedules.id, id));

  revalidateCoursePages();
  return null;
}

// ========================================
// Delete Schedule
// ========================================

export async function deleteScheduleAction(
  formData: FormData
) {
  await requireAdmin();

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return;
  }

  await db
    .delete(schema.schedules)
    .where(eq(schema.schedules.id, id));

  revalidateCoursePages();
}
