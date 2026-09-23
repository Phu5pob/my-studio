import Image from "next/image";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ManagementForm } from "@/components/admin/management-form";
import { deleteManagementAction } from "@/lib/actions/management";

export default async function AdminManagementPage() {
  const managers = await db.query.users.findMany({
    where: eq(schema.users.role, "admin"),
    orderBy: (u, { asc }) => [asc(u.name)],
  });

  return (
    <div className="space-y-10">
      {/* เพิ่มผู้บริหารใหม่ */}
      <div>
        <h2 className="font-display text-xl mb-4">เพิ่มผู้บริหารใหม่</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-2xl">
          <ManagementForm />
        </div>
      </div>

      {/* รายชื่อผู้บริหารทั้งหมด */}
      <div>
        <h2 className="font-display text-xl mb-4">ผู้บริหารทั้งหมด ({managers.length})</h2>
        <div className="space-y-4">
          {managers.map((m) => (
            <details key={m.id} className="border border-line rounded-md bg-white">
              <summary className="cursor-pointer list-none p-5 flex items-center gap-4">
                {/* รูปภาพ */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-ivory-deep shrink-0">
                  {m.avatarUrl ? (
                    <Image src={m.avatarUrl} alt={m.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-ink-soft/40">👤</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {m.position || "ยังไม่ได้กำหนดตำแหน่ง"} · {m.email}
                  </p>
                </div>
                <span className="text-xs text-burgundy shrink-0">แก้ไข</span>
              </summary>

              <div className="px-5 pb-5 space-y-4">
                <ManagementForm manager={m} />
                <div className="pt-2 border-t border-line">
                  <form action={deleteManagementAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="text-sm text-danger hover:underline">
                      ลบผู้บริหารคนนี้
                    </button>
                  </form>
                </div>
              </div>
            </details>
          ))}

          {managers.length === 0 && (
            <p className="text-sm text-ink-soft">ยังไม่มีข้อมูลผู้บริหาร</p>
          )}
        </div>
      </div>

      <div className="border border-line rounded-md p-5 bg-ivory-deep text-sm text-ink-soft">
        <p className="font-medium text-ink mb-1">หมายเหตุ</p>
        <p>ผู้บริหารที่เพิ่มในหน้านี้จะแสดงที่หน้า <strong>เกี่ยวกับเรา</strong> (/about) ครับ</p>
        <p className="mt-1">ผู้บริหารทุกคนสามารถ login เข้าแผงแอดมินได้</p>
      </div>
    </div>
  );
}
