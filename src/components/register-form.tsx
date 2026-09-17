"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/ui";

type Branch = { id: number; name: string };

export function RegisterForm({ branches }: { branches: Branch[] }) {
  const [state, formAction] = useActionState(registerAction, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? (
        <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-4 py-3">
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className="block text-sm text-ink-soft mb-1.5">
          ชื่อ-นามสกุล
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          placeholder="ชื่อของคุณ"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-ink-soft mb-1.5">
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm text-ink-soft mb-1.5">
          เบอร์โทรศัพท์
        </label>
        <input
          id="phone"
          name="phone"
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          placeholder="08x-xxx-xxxx"
        />
      </div>

      <div>
        <label htmlFor="branchId" className="block text-sm text-ink-soft mb-1.5">
          สาขาที่สะดวก
        </label>
        <select
          id="branchId"
          name="branchId"
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        >
          <option value="">ยังไม่แน่ใจ</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-ink-soft mb-1.5">
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />
      </div>

      <SubmitButton className="w-full" pendingText="กำลังสมัครสมาชิก…">
        สมัครสมาชิก
      </SubmitButton>

      <p className="text-sm text-ink-soft text-center">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="text-burgundy hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
