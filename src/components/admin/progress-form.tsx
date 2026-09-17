"use client";

import { useActionState } from "react";
import { createProgressAction } from "@/lib/actions/progress";
import { SubmitButton } from "@/components/ui";

type User = { id: number; name: string; email: string };
type Course = { id: number; title: string };

export function ProgressForm({ students, courses }: { students: User[]; courses: Course[] }) {
  const [state, formAction] = useActionState(createProgressAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">นักเรียน</label>
          <select
            name="userId"
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          >
            <option value="">เลือกนักเรียน</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">คอร์สเรียน</label>
          <select
            name="courseId"
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          >
            <option value="">เลือกคอร์ส</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ภาคเรียน</label>
          <input
            name="term"
            required
            placeholder="เช่น เทอม 1/2569"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">คะแนน (0-100)</label>
          <input
            type="number"
            name="score"
            min={0}
            max={100}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ระดับ/เกรด</label>
          <input
            name="skillLevel"
            placeholder="เช่น เกรด 2 (Trinity)"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1.5">ความคิดเห็นจากครู</label>
        <textarea
          name="teacherComment"
          rows={2}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      </div>

      <SubmitButton pendingText="กำลังบันทึก…">บันทึกผลการเรียน</SubmitButton>
    </form>
  );
}
