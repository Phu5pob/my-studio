"use client";
import { useActionState } from "react";
import { updateTeacherAction } from "@/lib/actions/teachers";
import { SubmitButton } from "@/components/ui";

type Admin = {
  id: number;
  name: string;
  position: string | null;
  avatarUrl: string | null;
  phone: string | null;
};

export function AdminPositionForm({ admin }: { admin: Admin }) {
  const [state, formAction] = useActionState(updateTeacherAction, null);
  return (
    <form action={formAction} className="space-y-4 mt-4">
      <input type="hidden" name="id" value={admin.id} />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ตำแหน่ง</label>
          <input name="position" defaultValue={admin.position ?? ""} placeholder="เช่น ผู้อำนวยการ" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">รูปภาพ (URL)</label>
          <input name="avatarUrl" defaultValue={admin.avatarUrl ?? ""} placeholder="https://..." className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
        </div>
      </div>
      <SubmitButton className="text-xs px-4 py-2" pendingText="กำลังบันทึก…">บันทึก</SubmitButton>
    </form>
  );
}
