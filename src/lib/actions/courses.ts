"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./auth";

function slugify(input: string) {
  return (
    input.toLowerCase().trim()
      .replace(/[^a-z0-9ก-๙\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || `course-${Date.now()}`
  );
}

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

export async function createCourseAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = courseSchema.safeParse({
    branchId: formData.get("branchId"), title: formData.get("title"),
    instrument: formData.get("instrument"), level: formData.get("level"),
    description: formData.get("description") || "", price: formData.get("price"),
    durationWeeks: formData.get("durationWeeks"), imageUrl: formData.get("imageUrl") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let counter = 1;
  while (await db.query.courses.findFirst({ where: eq(schema.courses.slug, slug) })) {
    slug = `${baseSlug}-${counter++}`;
  }
  await db.insert(schema.courses).values({ ...parsed.data, slug });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return null;
}

export async function updateCourseAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const parsed = courseSchema.safeParse({
    branchId: formData.get("branchId"), title: formData.get("title"),
    instrument: formData.get("instrument"), level: formData.get("level"),
    description: formData.get("description") || "", price: formData.get("price"),
    durationWeeks: formData.get("durationWeeks"), imageUrl: formData.get("imageUrl") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  await db.update(schema.courses).set(parsed.data).where(eq(schema.courses.id, id));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return null;
}

export async function toggleCourseActiveAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const isActive = formData.get("isActive") === "true";
  await db.update(schema.courses).set({ isActive: !isActive }).where(eq(schema.courses.id, id));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.delete(schema.courses).where(eq(schema.courses.id, id));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

const scheduleSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  teacherId: z.coerce.number().int().positive().optional(),
  roomId: z.coerce.number().int().positive().optional(),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  maxStudents: z.coerce.number().int().min(1),
});

export async function createScheduleAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = scheduleSchema.safeParse({
    courseId: formData.get("courseId"),
    teacherId: formData.get("teacherId") || undefined,
    roomId: formData.get("roomId") || undefined,
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    maxStudents: formData.get("maxStudents"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  await db.insert(schema.schedules).values({
    courseId: parsed.data.courseId,
    teacherId: parsed.data.teacherId ?? null,
    roomId: parsed.data.roomId ?? null,
    dayOfWeek: parsed.data.dayOfWeek,
    startTime: parsed.data.startTime,
    endTime: parsed.data.endTime,
    maxStudents: parsed.data.maxStudents,
  });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return null;
}

export async function deleteScheduleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.delete(schema.schedules).where(eq(schema.schedules.id, id));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}
