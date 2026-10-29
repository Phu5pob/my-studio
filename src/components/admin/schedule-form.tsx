
"use client";

import { useActionState } from "react";
import {
  createScheduleAction,
  updateScheduleAction,
} from "@/lib/actions/courses";
import { SubmitButton } from "@/components/ui";

const DAYS = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];

type Teacher = { id: number; name: string };
type Room = { id: number; name: string };

type Schedule = {
  id: number;
  courseId: number;
  teacherId: number | null;
  roomId: number | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxStudents: number;
};

type ScheduleFormProps = {
  courseId: number;
  teachers: Teacher[];
  rooms: Room[];
  schedule?: Schedule;
};

export function ScheduleForm({
  courseId,
  teachers,
  rooms,
  schedule,
}: ScheduleFormProps) {
  const isEditing = Boolean(schedule);

  const [state, formAction] = useActionState(
    isEditing ? updateScheduleAction : createScheduleAction,
    null
  );

  const inputClass =
    "w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30";

  return (
    <form
      key={schedule?.id ?? "new"}
      action={formAction}
      className="grid sm:grid-cols-3 gap-3 items-end"
    >
      <input type="hidden" name="courseId" value={courseId} />

      {schedule && (
        <input type="hidden" name="id" value={schedule.id} />
      )}

      {state?.error && (
        <p className="sm:col-span-3 text-xs text-danger">
          {state.error}
        </p>
      )}

      <div>
        <label className="block text-xs text-ink-soft mb-1">
          ครูผู้สอน
        </label>
        <select
          name="teacherId"
          defaultValue={schedule?.teacherId ?? ""}
          className={inputClass}
        >
          <option value="">ยังไม่กำหนด</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">
          ห้องเรียน
        </label>
        <select
          name="roomId"
          defaultValue={schedule?.roomId ?? ""}
          className={inputClass}
        >
          <option value="">ยังไม่กำหนด</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">
          วันสอน
        </label>
        <select
          name="dayOfWeek"
          defaultValue={schedule?.dayOfWeek ?? 0}
          className={inputClass}
        >
          {DAYS.map((day, index) => (
            <option key={index} value={index}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">
          เวลาเริ่ม
        </label>
        <input
          type="time"
          name="startTime"
          required
          defaultValue={schedule?.startTime ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">
          เวลาสิ้นสุด
        </label>
        <input
          type="time"
          name="endTime"
          required
          defaultValue={schedule?.endTime ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs text-ink-soft mb-1">
          รับสูงสุด (คน)
        </label>
        <input
          type="number"
          name="maxStudents"
          required
          min={1}
          defaultValue={schedule?.maxStudents ?? 8}
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-3">
        <SubmitButton
          className="text-xs px-4 py-2"
          pendingText={
            isEditing ? "กำลังบันทึก…" : "กำลังเพิ่ม…"
          }
        >
          {isEditing ? "บันทึกการแก้ไข" : "เพิ่มรอบเรียน"}
        </SubmitButton>
      </div>
    </form>
  );
}
