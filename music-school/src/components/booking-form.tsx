"use client";

import { useActionState } from "react";
import { createEnrollmentAction } from "@/lib/actions/enrollments";
import { SubmitButton } from "@/components/ui";
import { dayOfWeekLabel } from "@/lib/format";

type Schedule = {
  id: number;
  teacherName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string | null;
};

export function BookingForm({
  courseId,
  schedules,
}: {
  courseId: number;
  schedules: Schedule[];
}) {
  const [state, formAction] = useActionState(createEnrollmentAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />

      {state?.error ? (
        <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-4 py-3">
          {state.error}
        </p>
      ) : null}

      {schedules.length > 0 ? (
        <div>
          <label htmlFor="scheduleId" className="block text-sm text-ink-soft mb-1.5">
            เลือกรอบเรียน
          </label>
          <select
            id="scheduleId"
            name="scheduleId"
            required
            className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                วัน{dayOfWeekLabel(s.dayOfWeek)} {s.startTime}–{s.endTime} น. ·{" "}
                {s.teacherName}
                {s.room ? ` · ${s.room}` : ""}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-sm text-ink-soft">
          ยังไม่มีรอบเรียนที่เปิดสอน ทางโรงเรียนจะติดต่อจัดตารางให้หลังจองสำเร็จ
        </p>
      )}

      <div>
        <label htmlFor="note" className="block text-sm text-ink-soft mb-1.5">
          หมายเหตุ (ถ้ามี)
        </label>
        <textarea
          id="note"
          name="note"
          rows={2}
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          placeholder="เช่น ขอครูที่พูดภาษาอังกฤษได้"
        />
      </div>

      <SubmitButton className="w-full" pendingText="กำลังจอง…">
        จองคอร์สนี้
      </SubmitButton>
    </form>
  );
}
