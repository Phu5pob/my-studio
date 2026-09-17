"use client";

import { useActionState } from "react";
import { createCourseAction, updateCourseAction } from "@/lib/actions/courses";
import { SubmitButton } from "@/components/ui";

type Branch = { id: number; name: string };
type Course = {
  id: number;
  branchId: number;
  title: string;
  instrument: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string | null;
  price: number;
  durationWeeks: number;
  imageUrl: string | null;
};

export function CourseForm({ branches, course }: { branches: Branch[]; course?: Course }) {
  const action = course ? updateCourseAction : createCourseAction;
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {course ? <input type="hidden" name="id" value={course.id} /> : null}
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ชื่อคอร์ส</label>
          <input
            name="title"
            defaultValue={course?.title}
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">สาขา</label>
          <select
            name="branchId"
            defaultValue={course?.branchId}
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          >
            <option value="">เลือกสาขา</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">เครื่องดนตรี</label>
          <input
            name="instrument"
            defaultValue={course?.instrument}
            required
            placeholder="เช่น เปียโน"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ระดับ</label>
          <select
            name="level"
            defaultValue={course?.level ?? "beginner"}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          >
            <option value="beginner">เริ่มต้น</option>
            <option value="intermediate">ระดับกลาง</option>
            <option value="advanced">ระดับสูง</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ราคา (บาท)</label>
          <input
            type="number"
            name="price"
            defaultValue={course?.price}
            required
            min={0}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ระยะเวลา (สัปดาห์)</label>
          <input
            type="number"
            name="durationWeeks"
            defaultValue={course?.durationWeeks ?? 12}
            required
            min={1}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ลิงก์รูปภาพ (URL)</label>
          <input
            name="imageUrl"
            defaultValue={course?.imageUrl ?? ""}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1.5">รายละเอียดคอร์ส</label>
        <textarea
          name="description"
          defaultValue={course?.description ?? ""}
          rows={3}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      </div>

      <SubmitButton pendingText="กำลังบันทึก…">
        {course ? "บันทึกการแก้ไข" : "เพิ่มคอร์ส"}
      </SubmitButton>
    </form>
  );
}
