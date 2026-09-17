import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { dayOfWeekLabel } from "@/lib/format";

export default async function TeacherOverviewPage() {
  const session = await getSession();
  if (!session) return null;

  const mySchedules = await db.query.schedules.findMany({
    where: eq(schema.schedules.teacherId, session.userId),
    with: { course: { with: { branch: true } }, room: true, enrollments: true },
  });

  const myGrades = await db.query.progressRecords.findMany({
    where: eq(schema.progressRecords.teacherId, session.userId),
    with: { user: true, course: true },
    orderBy: (p, { desc }) => [desc(p.recordedAt)],
    limit: 5,
  });

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="border border-line rounded-md p-5 bg-white">
          <p className="text-xs text-ink-soft">คาบสอนทั้งหมด</p>
          <p className="font-display text-2xl mt-2">{mySchedules.length} คาบ</p>
        </div>
        <div className="border border-line rounded-md p-5 bg-white">
          <p className="text-xs text-ink-soft">บันทึกคะแนนล่าสุด</p>
          <p className="font-display text-2xl mt-2">{myGrades.length} รายการ</p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">ตารางสอนของฉัน</h2>
        {mySchedules.length === 0 ? (
          <p className="text-sm text-ink-soft">ยังไม่มีตารางสอน</p>
        ) : (
          <div className="space-y-3">
            {mySchedules.map((s) => (
              <div key={s.id} className="border border-line rounded-md p-4 bg-white flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{s.course.title}</p>
                  <p className="text-xs text-ink-soft mt-1">
                    {s.course.branch?.name} · {s.room?.name ?? "-"} ·
                    วัน{dayOfWeekLabel(s.dayOfWeek)} {s.startTime}–{s.endTime} น.
                  </p>
                </div>
                <span className="text-xs text-ink-soft">{s.enrollments.length}/{s.maxStudents} คน</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
