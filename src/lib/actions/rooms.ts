"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";

export async function createRoomAction(formData: FormData) {
  await requireAdmin();
  await db.insert(schema.rooms).values({
    branchId: Number(formData.get("branchId")),
    name: formData.get("name") as string,
    capacity: Number(formData.get("capacity")) || 1,
    description: (formData.get("description") as string) || "",
  });
  revalidatePath("/admin/rooms");
}

export async function deleteRoomAction(formData: FormData) {
  await requireAdmin();
  await db.delete(schema.rooms).where(eq(schema.rooms.id, Number(formData.get("id"))));
  revalidatePath("/admin/rooms");
}
