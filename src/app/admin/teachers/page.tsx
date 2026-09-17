import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatThaiDate } from "@/lib/format";
import { createTeacherAction, deleteTeacherAction } from "@/lib/actions/teachers";
import { TeacherForm } from "@/components/admin/teacher-form";

export default async function AdminTeachersPage() {
  const [branches, teachers] = await Promise.all([
    db.query.branches.findMany(),
    db.query.users.findMany({
      where: eq(schema.users.role, "teacher"),
      with: { branch: true },
      orderBy: (u, { asc }) => [asc(u.name)],
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl mb-4">เพิ่มครูผู้สอนใหม่</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-lg">
          <TeacherForm branches={branches} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">ครูผู้สอนทั้งหมด ({teachers.length})</h2>
        <div className="border border-line rounded-md overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-ivory-deep text-ink-soft text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-normal">ชื่อ</th>
                <th className="text-left px-4 py-3 font-normal">อีเมล</th>
                <th className="text-left px-4 py-3 font-normal">เบอร์โทร</th>
                <th className="text-left px-4 py-3 font-normal">สาขา</th>
                <th className="text-left px-4 py-3 font-normal">เพิ่มเมื่อ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{t.email}</td>
                  <td className="px-4 py-3 text-ink-soft">{t.phone || "-"}</td>
                  <td className="px-4 py-3 text-ink-soft">{t.branch?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatThaiDate(t.createdAt)}</td>
                  <td className="px-4 py-3">
                    <form action={deleteTeacherAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="text-xs text-danger hover:underline">ลบ</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
