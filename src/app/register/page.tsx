import { db } from "@/db";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage() {
  const branches = await db.query.branches.findMany();

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-3xl mb-2">สมัครเรียน</h1>
      <p className="text-sm text-ink-soft mb-8">
        สร้างบัญชีเพื่อจองคอร์สเรียน ติดตามผลการเรียน และชำระค่าเทอมออนไลน์
      </p>
      <RegisterForm branches={branches} />
    </div>
  );
}
