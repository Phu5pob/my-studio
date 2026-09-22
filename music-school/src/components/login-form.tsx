"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/ui";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? (
        <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-4 py-3">
          {state.error}
        </p>
      ) : null}

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
        <label htmlFor="password" className="block text-sm text-ink-soft mb-1.5">
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton className="w-full" pendingText="กำลังเข้าสู่ระบบ…">
        เข้าสู่ระบบ
      </SubmitButton>

      <p className="text-sm text-ink-soft text-center">
        ยังไม่มีบัญชี?{" "}
        <Link href="/register" className="text-burgundy hover:underline">
          สมัครเรียนที่นี่
        </Link>
      </p>
    </form>
  );
}
