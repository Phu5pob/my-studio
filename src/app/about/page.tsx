import Image from "next/image";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export default async function AboutPage() {
  const admins = await db.query.users.findMany({
    where: eq(schema.users.role, "admin"),
    orderBy: (u, { asc }) => [asc(u.name)],
  });

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
      <p className="text-sm tracking-wide text-brass mb-3">เกี่ยวกับเรา</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-4 max-w-lg">
        ทีมผู้บริหาร My Studio
      </h1>
      <p className="text-ink-soft mb-16 max-w-xl leading-relaxed">
        ผู้บริหารที่มีความมุ่งมั่นในการพัฒนาการศึกษาดนตรีให้เข้าถึงได้ทุกคน
        ทุกวัย ในทุกพื้นที่ของภาคใต้
      </p>

      {admins.length === 0 ? (
        <p className="text-ink-soft">ยังไม่มีข้อมูลผู้บริหาร</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {admins.map((admin) => (
            <div key={admin.id} className="text-center">
              {/* รูปภาพ */}
              <div className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden bg-ivory-deep border-4 border-line">
                {admin.avatarUrl ? (
                  <Image
                    src={admin.avatarUrl}
                    alt={admin.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl text-ink-soft/30">👤</span>
                  </div>
                )}
              </div>
              <p className="font-display text-xl">{admin.name}</p>
              {admin.position && (
                <p className="text-sm text-brass mt-1">{admin.position}</p>
              )}
              {admin.phone && (
                <p className="text-xs text-ink-soft mt-2">{admin.phone}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* วิสัยทัศน์ */}
      <div className="mt-20 bg-white border border-line rounded-md p-8 sm:p-12">
        <h2 className="font-display text-2xl mb-4">วิสัยทัศน์ของเรา</h2>
        <p className="text-ink-soft leading-relaxed max-w-2xl">
          My Studio มุ่งมั่นที่จะเป็นโรงเรียนสอนดนตรีที่ดีที่สุดในภาคใต้
          ด้วยครูผู้สอนมืออาชีพ สภาพแวดล้อมที่เหมาะสม
          และหลักสูตรที่ออกแบบมาเพื่อนักเรียนทุกระดับ ทุกวัย
        </p>
      </div>
    </div>
  );
}
