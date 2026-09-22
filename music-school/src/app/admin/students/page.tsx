import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatThaiDate } from "@/lib/format";

export default async function AdminStudentsPage() {
  const students = await db.query.users.findMany({
    where: eq(schema.users.role, "student"),
    with: { branch: true },
    orderBy: (u, { desc }) => [desc(u.createdAt)],
  });

  return (
    <div>
      <h2 className="font-display text-xl mb-4">นักเรียนทั้งหมด ({students.length})</h2>
      <div className="border border-line rounded-md overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-ivory-deep text-ink-soft text-xs">
            <tr>
              <th className="text-left px-4 py-3 font-normal">ชื่อ</th>
              <th className="text-left px-4 py-3 font-normal">อีเมล</th>
              <th className="text-left px-4 py-3 font-normal">เบอร์โทร</th>
              <th className="text-left px-4 py-3 font-normal">สาขา</th>
              <th className="text-left px-4 py-3 font-normal">สมัครเมื่อ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 text-ink-soft">{s.email}</td>
                <td className="px-4 py-3 text-ink-soft">{s.phone || "-"}</td>
                <td className="px-4 py-3 text-ink-soft">{s.branch?.name ?? "-"}</td>
                <td className="px-4 py-3 text-ink-soft">{formatThaiDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
