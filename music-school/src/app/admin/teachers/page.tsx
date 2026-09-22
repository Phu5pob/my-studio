import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatThaiDate } from "@/lib/format";
import { deleteTeacherAction } from "@/lib/actions/teachers";
import { TeacherForm } from "@/components/admin/teacher-form";
import { AdminPositionForm } from "@/components/admin/admin-position-form";

export default async function AdminTeachersPage() {
  const [branches, teachers, admins] = await Promise.all([
    db.query.branches.findMany(),
    db.query.users.findMany({
      where: eq(schema.users.role, "teacher"),
      with: { branch: true },
      orderBy: (u, { asc }) => [asc(u.name)],
    }),
    db.query.users.findMany({
      where: eq(schema.users.role, "admin"),
      orderBy: (u, { asc }) => [asc(u.name)],
    }),
  ]);

  return (
    <div className="space-y-12">
      {/* ผู้บริหาร */}
      <div>
        <h2 className="font-display text-xl mb-4">ข้อมูลผู้บริหาร</h2>
        <div className="space-y-4">
          {admins.map((admin) => (
            <details key={admin.id} className="border border-line rounded-md bg-white">
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-xs text-ink-soft mt-1">{admin.position || "ยังไม่ได้กำหนดตำแหน่ง"}</p>
                </div>
                <span className="text-xs text-burgundy shrink-0">แก้ไข</span>
              </summary>
              <div className="p-5 pt-0">
                <AdminPositionForm admin={admin} />
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ครูผู้สอน */}
      <div>
        <h2 className="font-display text-xl mb-4">เพิ่มครูผู้สอนใหม่</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-2xl">
          <TeacherForm branches={branches} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">ครูผู้สอนทั้งหมด ({teachers.length})</h2>
        <div className="space-y-4">
          {teachers.map((t) => (
            <div key={t.id} className="border border-line rounded-md p-5 bg-white flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-ink-soft mt-1">{t.branch?.name ?? "-"} · {t.instruments || "-"}</p>
                {t.education && <p className="text-xs text-ink-soft mt-1">🎓 {t.education}</p>}
                {t.experience && <p className="text-xs text-ink-soft mt-1">⏱ {t.experience}</p>}
                <p className="text-xs text-ink-soft mt-1">{t.email}</p>
              </div>
              <form action={deleteTeacherAction} className="shrink-0">
                <input type="hidden" name="id" value={t.id} />
                <button className="text-xs text-danger hover:underline">ลบ</button>
              </form>
            </div>
          ))}
          {teachers.length === 0 && <p className="text-sm text-ink-soft">ยังไม่มีครูผู้สอน</p>}
        </div>
      </div>
    </div>
  );
}
