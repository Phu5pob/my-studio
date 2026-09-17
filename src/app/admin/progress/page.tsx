import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ProgressForm } from "@/components/admin/progress-form";
import { deleteProgressAction } from "@/lib/actions/progress";
import { formatThaiDate } from "@/lib/format";

export default async function AdminProgressPage() {
  const [students, courses, records] = await Promise.all([
    db.query.users.findMany({ where: eq(schema.users.role, "student") }),
    db.query.courses.findMany(),
    db.query.progressRecords.findMany({
      with: { user: true, course: true },
      orderBy: (p, { desc }) => [desc(p.recordedAt)],
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl mb-4">บันทึกผลการเรียนใหม่</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-2xl">
          <ProgressForm students={students} courses={courses} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">บันทึกทั้งหมด ({records.length})</h2>
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="border border-line rounded-md p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {r.user.name} · {r.course.title}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">
                    {r.term}
                    {r.score !== null ? ` · คะแนน ${r.score}` : ""}
                    {r.skillLevel ? ` · ${r.skillLevel}` : ""}
                  </p>
                  {r.teacherComment ? (
                    <p className="text-sm text-ink-soft mt-2">“{r.teacherComment}”</p>
                  ) : null}
                  <p className="text-xs text-ink-soft mt-2">
                    บันทึกเมื่อ {formatThaiDate(r.recordedAt)}
                  </p>
                </div>
                <form action={deleteProgressAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button className="text-xs text-danger hover:underline shrink-0">ลบ</button>
                </form>
              </div>
            </div>
          ))}
          {records.length === 0 ? (
            <p className="text-sm text-ink-soft">ยังไม่มีบันทึกผลการเรียน</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
