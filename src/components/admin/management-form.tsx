"use client";
import { useActionState } from "react";
import { createManagementAction, updateManagementAction } from "@/lib/actions/management";
import { SubmitButton } from "@/components/ui";

type Manager = {
  id: number;
  name: string;
  email: string;
  position: string | null;
  phone: string | null;
  avatarUrl: string | null;
};

export function ManagementForm({ manager }: { manager?: Manager }) {
  const action = manager ? updateManagementAction : createManagementAction;
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {manager && <input type="hidden" name="id" value={manager.id} />}
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ชื่อ-นามสกุล</label>
          <input
            name="name"
            required
            defaultValue={manager?.name}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ตำแหน่ง</label>
          <input
            name="position"
            defaultValue={manager?.position ?? ""}
            placeholder="เช่น ผู้อำนวยการ, ผู้จัดการสาขา"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
          />
        </div>
      </div>

      {!manager && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-soft mb-1.5">อีเมล</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-soft mb-1.5">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              placeholder="ค่าเริ่มต้น: admin1234"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
            />
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">เบอร์โทร</label>
          <input
            name="phone"
            defaultValue={manager?.phone ?? ""}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">รูปภาพ (URL)</label>
          <input
            name="avatarUrl"
            defaultValue={manager?.avatarUrl ?? ""}
            placeholder="https://..."
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30"
          />
        </div>
      </div>

      <SubmitButton pendingText="กำลังบันทึก…">
        {manager ? "บันทึกการแก้ไข" : "เพิ่มผู้บริหาร"}
      </SubmitButton>
    </form>
  );
}
