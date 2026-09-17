import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { dayOfWeekLabel } from "@/lib/format";

export default async function TeacherSchedulePage() {
  const session = await getSession();
  if (!session) return null;

  const schedules = await db.query.schedules.findMany({
    where: eq(schema.schedules.teacherId, session.userId),
    with: {
      course: { with: { branch: true } },
      room: true,
      enrollments: { with: { user: true } },
    },
    orderBy: (s, { asc }) => [asc(s.dayOfWeek), asc(s.startTime)],
  });

  return (
    <div>
      <h2 className="font-display text-xl mb-1">ตารางสอนของฉัน</h2>
      <p className="text-sm text-ink-soft mb-6">ห้องเรียนและนักเรียนในความดูแล</p>

      {schedules.length === 0 ? (
        <p className="text-sm text-ink-soft">ยังไม่มีตารางสอนที่กำหนดให้</p>
      ) : (
        <div className="space-y-6">
          {schedules.map((s) => (
            <div key={s.id} className="border border-line rounded-md bg-white overflow-hidden">
              <div className="bg-burgundy/10 px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-burgundy">{s.course.title}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    วัน{dayOfWeekLabel(s.dayOfWeek)} {s.startTime}–{s.endTime} น. ·
                    {s.room?.name ?? "ยังไม่กำหนดห้อง"} · {s.course.branch?.name}
                  </p>
                </div>
                <span className="text-sm font-medium">{s.enrollments.length}/{s.maxStudents} คน</span>
              </div>
              <div className="px-5 py-3">
                {s.enrollments.length === 0 ? (
                  <p className="text-sm text-ink-soft">ยังไม่มีนักเรียนในรอบนี้</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {s.enrollments.map((e) => (
                      <li key={e.id} className="py-2 text-sm flex items-center justify-between">
                        <span>{e.user.name}</span>
                        <span className="text-xs text-ink-soft">{e.user.phone}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
