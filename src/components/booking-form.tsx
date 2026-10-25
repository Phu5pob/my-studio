
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

type BookingFormProps = {
  courseId: number;
  schedules: Schedule[];
};

export function BookingForm({
  courseId,
  schedules,
}: BookingFormProps) {
  const [state, formAction] = useActionState(
    createEnrollmentAction,
    null
  );

  const hasSchedules = schedules.length > 0;

  return (
    <form
      action={formAction}
      className="space-y-4"
    >
      {/* Course ID */}
      <input
        type="hidden"
        name="courseId"
        value={courseId}
      />

      {/* Error Message */}
      {state?.error && (
        <div
          role="alert"
          className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-4 py-3"
        >
          {state.error}
        </div>
      )}

      {/* Schedule Selection */}
      {hasSchedules ? (
        <div>
          <label
            htmlFor="scheduleId"
            className="block text-sm text-ink-soft mb-1.5"
          >
            เลือกรอบเรียน
          </label>

          <select
            id="scheduleId"
            name="scheduleId"
            required
            defaultValue=""
            className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          >
            <option value="" disabled>
              กรุณาเลือกรอบเรียน
            </option>

            {schedules.map((schedule) => (
              <option
                key={schedule.id}
                value={schedule.id}
              >
                วัน{dayOfWeekLabel(schedule.dayOfWeek)}
                {" "}
                {schedule.startTime}–
                {schedule.endTime} น.
                {" · "}
                {schedule.teacherName}
                {schedule.room
                  ? ` · ${schedule.room}`
                  : ""}
              </option>
            ))}
          </select>

          <p className="text-xs text-ink-soft mt-2">
            กรุณาเลือกวันและเวลาเรียนที่ต้องการ
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            คอร์สนี้ยังไม่มีรอบเรียนที่เปิดให้จอง
          </p>
        </div>
      )}

      {/* Note */}
      <div>
        <label
          htmlFor="note"
          className="block text-sm text-ink-soft mb-1.5"
        >
          หมายเหตุ (ถ้ามี)
        </label>

        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={1000}
          className="w-full rounded-md border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          placeholder="เช่น ต้องการเรียนช่วงเช้า"
        />
      </div>

      {/* Booking Button */}
      {hasSchedules ? (
        <SubmitButton
          className="w-full"
          pendingText="กำลังตรวจสอบและจอง..."
        >
          ยืนยันการจองคอร์สเรียน
        </SubmitButton>
      ) : (
        <button
          type="button"
          disabled
          className="w-full rounded-md bg-gray-300 px-4 py-3 text-white cursor-not-allowed"
        >
          ยังไม่สามารถจองคอร์สนี้ได้
        </button>
      )}
    </form>
  );
}
