import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { formatThaiDate } from "@/lib/format";

export default async function ProgressPage() {
  const session = await getSession();
  if (!session) return null;

  const records = await db.query.progressRecords.findMany({
    where: eq(schema.progressRecords.userId, session.userId),
    with: { course: true },
    orderBy: (p, { desc }) => [desc(p.recordedAt)],
  });

  return (
    <div>
      <h2 className="font-display text-xl mb-1">ผลการเรียน</h2>
      <p className="text-sm text-ink-soft mb-6">
        บันทึกความก้าวหน้าและความคิดเห็นจากครูผู้สอน
      </p>

      {records.length === 0 ? (
        <p className="text-sm text-ink-soft">ยังไม่มีบันทึกผลการเรียน</p>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.id} className="border border-line rounded-md p-5 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{r.course.title}</p>
                  <p className="text-xs text-ink-soft mt-1">{r.term}</p>
                </div>
                {r.score !== null ? (
                  <span className="font-display text-2xl text-burgundy">{r.score}</span>
                ) : null}
              </div>
              {r.skillLevel ? (
                <p className="text-xs text-brass mt-3">{r.skillLevel}</p>
              ) : null}
              {r.teacherComment ? (
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                  “{r.teacherComment}”
                </p>
              ) : null}
              <p className="text-xs text-ink-soft mt-3">
                บันทึกเมื่อ {formatThaiDate(r.recordedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
