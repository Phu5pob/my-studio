"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./auth";

const branchSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่อสาขา"),
  address: z.string().min(2, "กรุณากรอกที่อยู่"),
  phone: z.string().min(4, "กรุณากรอกเบอร์โทร"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function createBranchAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = branchSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  await db.insert(schema.branches).values(parsed.data);
  revalidatePath("/admin/branches");
  revalidatePath("/branches");
  return null;
}

export async function updateBranchAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = Number(formData.get("id"));

  const parsed = branchSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    description: formData.get("description") || "",
    imageUrl: formData.get("imageUrl") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  await db.update(schema.branches).set(parsed.data).where(eq(schema.branches.id, id));
  revalidatePath("/admin/branches");
  revalidatePath("/branches");
  return null;
}

export async function deleteBranchAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.delete(schema.branches).where(eq(schema.branches.id, id));
  revalidatePath("/admin/branches");
  revalidatePath("/branches");
}
