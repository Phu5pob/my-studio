
import { db, schema } from "./index";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
  if (process.env.ALLOW_DEV_ADMIN_SETUP !== "true") {
    throw new Error("ต้องอนุญาตการสร้างบัญชีทดสอบก่อน");
  }

  const email = "admin@mystudio.example";

  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (existing) {
    console.log("บัญชีนี้มีอยู่แล้ว ไม่ได้แก้ไขข้อมูล");
    return;
  }

  const branch = await db.query.branches.findFirst();

  if (!branch) {
    throw new Error("ไม่พบสาขาในฐานข้อมูล");
  }

  const password = process.env.DEV_ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error(
      "กำหนด DEV_ADMIN_PASSWORD อย่างน้อย 12 ตัวอักษร"
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(schema.users).values({
    name: "ผู้ดูแลระบบทดสอบ",
    email,
    passwordHash,
    role: "admin",
    branchId: branch.id,
  });

  console.log("สร้างบัญชี Admin ทดสอบสำเร็จ");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
