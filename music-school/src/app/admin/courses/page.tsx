import { db } from "@/db";
import { CourseForm } from "@/components/admin/course-form";
import { ScheduleForm } from "@/components/admin/schedule-form";
import {
  deleteCourseAction,
  toggleCourseActiveAction,
  deleteScheduleAction,
} from "@/lib/actions/courses";
import { formatCurrency, LEVEL_LABELS, dayOfWeekLabel } from "@/lib/format";

export default async function AdminCoursesPage() {
  const [branches, courses, teachers, rooms] = await Promise.all([
    db.query.branches.findMany(),
    db.query.courses.findMany({
      with: {
        branch: true,
        schedules: { with: { teacher: true, room: true } },
      },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    }),
    db.query.users.findMany({ where: (u, { eq }) => eq(u.role, "teacher") }),
    db.query.rooms.findMany({ with: { branch: true } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl mb-4">เพิ่มคอร์สใหม่</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-3xl">
          <CourseForm branches={branches} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">คอร์สทั้งหมด ({courses.length})</h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <details key={course.id} className="border border-line rounded-md bg-white">
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {course.title}{" "}
                    {!course.isActive && <span className="text-xs text-ink-soft">(ปิดรับสมัคร)</span>}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">
                    {course.branch?.name} · {course.instrument} · {LEVEL_LABELS[course.level]} · {formatCurrency(course.price)}
                  </p>
                </div>
                <span className="text-xs text-burgundy shrink-0">จัดการ</span>
              </summary>

              <div className="p-5 pt-0 space-y-6">
                <CourseForm branches={branches} course={course} />

                <div className="flex gap-4 pt-4 border-t border-line">
                  <form action={toggleCourseActiveAction}>
                    <input type="hidden" name="id" value={course.id} />
                    <input type="hidden" name="isActive" value={String(course.isActive)} />
                    <button className="text-sm text-ink-soft hover:text-burgundy">
                      {course.isActive ? "ปิดรับสมัคร" : "เปิดรับสมัคร"}
                    </button>
                  </form>
                  <form action={deleteCourseAction}>
                    <input type="hidden" name="id" value={course.id} />
                    <button className="text-sm text-danger hover:underline">ลบคอร์สนี้</button>
                  </form>
                </div>

                <div className="pt-4 border-t border-line">
                  <p className="text-sm font-medium mb-3">ตารางเรียน</p>
                  {course.schedules.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {course.schedules.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm bg-ivory-deep rounded-md px-3 py-2">
                          <span>
                            วัน{dayOfWeekLabel(s.dayOfWeek)} {s.startTime}–{s.endTime} น. ·{" "}
                            {s.teacher?.name ?? "ยังไม่มีครู"} · {s.room?.name ?? "ยังไม่กำหนดห้อง"} · รับสูงสุด {s.maxStudents} คน
                          </span>
                          <form action={deleteScheduleAction}>
                            <input type="hidden" name="id" value={s.id} />
                            <button className="text-xs text-danger hover:underline ml-3">ลบ</button>
                          </form>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ink-soft mb-4">ยังไม่มีรอบเรียน</p>
                  )}
                  <ScheduleForm courseId={course.id} teachers={teachers} rooms={rooms.filter(r => r.branchId === course.branchId)} />
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
