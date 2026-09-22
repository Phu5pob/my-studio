"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin, hashPassword } from "@/lib/auth";
import type { ActionState } from "./auth";

export async function createTeacherAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const email = (formData.get("email") as string).toLowerCase();
  const existing = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (existing) return { error: "อีเมลนี้ถูกใช้แล้ว" };
  const passwordHash = await hashPassword(formData.get("password") as string);
  await db.insert(schema.users).values({
    name: formData.get("name") as string,
    email,
    passwordHash,
    role: "teacher",
    phone: (formData.get("phone") as string) || "",
    branchId: formData.get("branchId") ? Number(formData.get("branchId")) : null,
    avatarUrl: (formData.get("avatarUrl") as string) || "",
    education: (formData.get("education") as string) || "",
    experience: (formData.get("experience") as string) || "",
    instruments: (formData.get("instruments") as string) || "",
  });
  revalidatePath("/admin/teachers");
  revalidatePath("/teachers");
  return null;
}

export async function updateTeacherAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.update(schema.users).set({
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || "",
    branchId: formData.get("branchId") ? Number(formData.get("branchId")) : null,
    avatarUrl: (formData.get("avatarUrl") as string) || "",
    education: (formData.get("education") as string) || "",
    experience: (formData.get("experience") as string) || "",
    instruments: (formData.get("instruments") as string) || "",
    position: (formData.get("position") as string) || "",
  }).where(eq(schema.users.id, id));
  revalidatePath("/admin/teachers");
  revalidatePath("/teachers");
  revalidatePath("/about");
  return null;
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();
  await db.delete(schema.users).where(eq(schema.users.id, Number(formData.get("id"))));
  revalidatePath("/admin/teachers");
  revalidatePath("/teachers");
}
