"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import {
  hashPassword,
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";

export type ActionState = { error?: string } | null;

const registerSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่อ-นามสกุล"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  phone: z.string().optional(),
  branchId: z.string().optional(),
});

export async function registerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
    branchId: formData.get("branchId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const { name, email, password, phone, branchId } = parsed.data;

  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, email.toLowerCase()),
  });
  if (existing) {
    return { error: "อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว" };
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(schema.users)
    .values({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "student",
      phone: phone ?? "",
      branchId: branchId ? Number(branchId) : null,
    })
    .returning();

  await setSessionCookie({
    userId: user.id,
    role: "student",
    name: user.name,
    email: user.email,
  });

  redirect("/dashboard");
}

const loginSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const { email, password } = parsed.data;

  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email.toLowerCase()),
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  await setSessionCookie({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });

  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  "use server";
  await clearSessionCookie();
  redirect("/");
}
