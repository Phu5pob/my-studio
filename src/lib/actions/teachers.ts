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
  });
  revalidatePath("/admin/teachers");
  return null;
}

export async function deleteTeacherAction(formData: FormData) {
  await requireAdmin();
  await db.delete(schema.users).where(eq(schema.users.id, Number(formData.get("id"))));
  revalidatePath("/admin/teachers");
}
