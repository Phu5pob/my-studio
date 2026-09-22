import Image from "next/image";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export default async function TeachersPage() {
  const branches = await db.query.branches.findMany({
    with: {
      users: true,
    },
  });

  const teachers = await db.query.users.findMany({
    where: eq(schema.users.role, "teacher"),
    with: { branch: true },
    orderBy: (u, { asc }) => [asc(u.branchId), asc(u.name)],
  });

  // จัดกลุ่มครูตามสาขา
  const teachersByBranch = branches.map((branch) => ({
    ...branch,
    teachers: teachers.filter((t) => t.branchId === branch.id),
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
      <p className="text-sm tracking-wide text-brass mb-3">ทีมครูผู้สอน</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-4 max-w-lg">
        ครูผู้สอนมืออาชีพของเรา
      </h1>
      <p className="text-ink-soft mb-12 max-w-xl leading-relaxed">
        ครูทุกท่านผ่านการคัดเลือกและมีประสบการณ์สอนดนตรีมาอย่างยาวนาน
        พร้อมส่งเสริมศักยภาพของนักเรียนทุกคน
      </p>

      {teachersByBranch.map((branch) =>
        branch.teachers.length > 0 ? (
          <div key={branch.id} className="mb-16">
            <h2 className="font-display text-2xl mb-8 pb-3 border-b border-line">
              {branch.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {branch.teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white border border-line rounded-md overflow-hidden">
                  {/* รูปภาพ */}
                  <div className="relative aspect-[4/3] bg-ivory-deep">
                    {teacher.avatarUrl ? (
                      <Image
                        src={teacher.avatarUrl}
                        alt={teacher.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl text-ink-soft/30">♪</span>
                      </div>
                    )}
                  </div>
                  {/* ข้อมูล */}
                  <div className="p-5">
                    <p className="font-display text-xl">{teacher.name}</p>
                    {teacher.instruments && (
                      <p className="text-sm text-brass mt-1">{teacher.instruments}</p>
                    )}
                    {teacher.education && (
                      <div className="mt-3">
                        <p className="text-xs text-ink-soft mb-0.5">การศึกษา</p>
                        <p className="text-sm">{teacher.education}</p>
                      </div>
                    )}
                    {teacher.experience && (
                      <div className="mt-2">
                        <p className="text-xs text-ink-soft mb-0.5">ประสบการณ์</p>
                        <p className="text-sm">{teacher.experience}</p>
                      </div>
                    )}
                    {teacher.phone && (
                      <p className="text-xs text-ink-soft mt-3">{teacher.phone}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {teachers.length === 0 && (
        <p className="text-ink-soft">ยังไม่มีข้อมูลครูผู้สอน</p>
      )}
    </div>
  );
}
