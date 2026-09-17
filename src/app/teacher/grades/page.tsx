import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { formatThaiDate } from "@/lib/format";
import { ProgressForm } from "@/components/admin/progress-form";
import { deleteProgressAction } from "@/lib/actions/progress";

export default async function TeacherGradesPage() {
  const session = await getSession();
  if (!session) return null;

  // นักเรียนในรอบที่ครูสอน
  const mySchedules = await db.query.schedules.findMany({
    where: eq(schema.schedules.teacherId, session.userId),
    with: { enrollments: { with: { user: true } }, course: true },
  });

  const studentSet = new Map<number, { id: number; name: string; email: string }>();
  const courseSet = new Map<number, { id: number; title: string }>();
  for (const s of mySchedules) {
    courseSet.set(s.course.id, { id: s.course.id, title: s.course.title });
    for (const e of s.enrollments) {
      studentSet.set(e.user.id, { id: e.user.id, name: e.user.name, email: e.user.email });
    }
  }

  const students = Array.from(studentSet.values());
  const courses = Array.from(courseSet.values());

  const myGrades = await db.query.progressRecords.findMany({
    where: eq(schema.progressRecords.teacherId, session.userId),
    with: { user: true, course: true },
    orderBy: (p, { desc }) => [desc(p.recordedAt)],
  });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl mb-4">บันทึกคะแนนนักเรียน</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-2xl">
          {students.length === 0 ? (
            <p className="text-sm text-ink-soft">ยังไม่มีนักเรียนในรอบที่สอน</p>
          ) : (
            <ProgressForm students={students} courses={courses} />
          )}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">บันทึกที่ฉันให้ ({myGrades.length})</h2>
        <div className="space-y-3">
          {myGrades.map((r) => (
            <div key={r.id} className="border border-line rounded-md p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{r.user.name} · {r.course.title}</p>
                  <p className="text-xs text-ink-soft mt-1">
                    {r.term}{r.score !== null ? ` · คะแนน ${r.score}` : ""}{r.skillLevel ? ` · ${r.skillLevel}` : ""}
                  </p>
                  {r.teacherComment && <p className="text-sm text-ink-soft mt-2">"{r.teacherComment}"</p>}
                  <p className="text-xs text-ink-soft mt-2">{formatThaiDate(r.recordedAt)}</p>
                </div>
                <form action={deleteProgressAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="text-xs text-danger hover:underline">ลบ</button>
                </form>
              </div>
            </div>
          ))}
          {myGrades.length === 0 && <p className="text-sm text-ink-soft">ยังไม่มีบันทึกคะแนน</p>}
        </div>
      </div>
    </div>
  );
}
