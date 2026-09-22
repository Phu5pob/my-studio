"use client";

import { useActionState } from "react";
import { createScheduleAction } from "@/lib/actions/courses";
import { SubmitButton } from "@/components/ui";

const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

type Teacher = { id: number; name: string };
type Room = { id: number; name: string };

export function ScheduleForm({
  courseId,
  teachers,
  rooms,
}: {
  courseId: number;
  teachers: Teacher[];
  rooms: Room[];
}) {
  const [state, formAction] = useActionState(createScheduleAction, null);

  return (
    <form action={formAction} className="grid sm:grid-cols-3 gap-3 items-end">
      <input type="hidden" name="courseId" value={courseId} />
      {state?.error && <p className="sm:col-span-3 text-xs text-danger">{state.error}</p>}

      <div>
        <label className="block text-xs text-ink-soft mb-1">ครูผู้สอน</label>
        <select name="teacherId" className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30">
          <option value="">ยังไม่กำหนด</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">ห้องเรียน</label>
        <select name="roomId" className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30">
          <option value="">ยังไม่กำหนด</option>
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">วันสอน</label>
        <select name="dayOfWeek" className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30">
          {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">เวลาเริ่ม</label>
        <input type="time" name="startTime" required className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">เวลาสิ้นสุด</label>
        <input type="time" name="endTime" required className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">รับสูงสุด (คน)</label>
        <input type="number" name="maxStudents" defaultValue={8} min={1} className="w-full rounded-md border border-line bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
      </div>

      <div className="sm:col-span-3">
        <SubmitButton className="text-xs px-4 py-2" pendingText="กำลังเพิ่ม…">เพิ่มรอบเรียน</SubmitButton>
      </div>
    </form>
  );
}
