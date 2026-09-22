"use client";
import { useActionState } from "react";
import { createTeacherAction } from "@/lib/actions/teachers";
import { SubmitButton } from "@/components/ui";

type Branch = { id: number; name: string };

export function TeacherForm({ branches }: { branches: Branch[] }) {
  const [state, formAction] = useActionState(createTeacherAction, null);
  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ชื่อ-นามสกุล</label>
          <input name="name" required className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">อีเมล</label>
          <input type="email" name="email" required className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">รหัสผ่าน</label>
          <input type="password" name="password" required minLength={6} className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">เบอร์โทร</label>
          <input name="phone" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">สาขาประจำ</label>
          <select name="branchId" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30">
            <option value="">ไม่ระบุ</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">เครื่องดนตรีที่สอน</label>
          <input name="instruments" placeholder="เช่น เปียโน, กีตาร์" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-ink-soft mb-1.5">การศึกษา / จบจากที่ไหน</label>
        <input name="education" placeholder="เช่น ปริญญาตรี ดุริยางคศาสตร์ มหาวิทยาลัยมหิดล" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
      </div>
      <div>
        <label className="block text-sm text-ink-soft mb-1.5">ประสบการณ์</label>
        <input name="experience" placeholder="เช่น สอนดนตรีมากกว่า 10 ปี" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
      </div>
      <div>
        <label className="block text-sm text-ink-soft mb-1.5">รูปภาพ (URL)</label>
        <input name="avatarUrl" placeholder="https://..." className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
      </div>
      <SubmitButton pendingText="กำลังเพิ่ม…">เพิ่มครู</SubmitButton>
    </form>
  );
}
