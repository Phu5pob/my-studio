import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { dayOfWeekLabel } from "@/lib/format";

export default async function StudentRoomsPage() {
  const session = await getSession();
  if (!session) return null;

  // ดูรอบที่นักเรียนจองอยู่
  const enrollments = await db.query.enrollments.findMany({
    where: eq(schema.enrollments.userId, session.userId),
    with: {
      schedule: { with: { room: { with: { branch: true } }, teacher: true } },
      course: true,
    },
  });

  const activeEnrollments = enrollments.filter(
    (e) => e.status === "confirmed" || e.status === "pending"
  );

  // ดูห้องทั้งหมดของสาขา
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.userId),
    with: { branch: { with: { rooms: true } } },
  });

  return (
    <div>
      <h2 className="font-display text-xl mb-1">ห้องเรียนของฉัน</h2>
      <p className="text-sm text-ink-soft mb-6">ห้องเรียนและตารางสอนของคอร์สที่คุณจองไว้</p>

      {activeEnrollments.length === 0 ? (
        <div className="border border-dashed border-line rounded-md p-8 text-center">
          <p className="text-sm text-ink-soft mb-4">คุณยังไม่มีคอร์สที่จองอยู่</p>
        </div>
      ) : (
        <div className="space-y-4 mb-10">
          {activeEnrollments.map((e) => (
            <div key={e.id} className="border border-line rounded-md bg-white overflow-hidden">
              <div className="bg-burgundy/10 px-5 py-3">
                <p className="font-medium text-burgundy">{e.course.title}</p>
              </div>
              <div className="px-5 py-4 grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-ink-soft mb-1">ห้องเรียน</p>
                  <p className="font-medium">{e.schedule?.room?.name ?? "ยังไม่กำหนดห้อง"}</p>
                  {e.schedule?.room?.branch && (
                    <p className="text-xs text-ink-soft">{e.schedule.room.branch.name}</p>
                  )}
                  {e.schedule?.room?.description && (
                    <p className="text-xs text-ink-soft">{e.schedule.room.description}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-1">ครูผู้สอน</p>
                  <p className="font-medium">{e.schedule?.teacher?.name ?? "-"}</p>
                  {e.schedule?.teacher?.phone && (
                    <p className="text-xs text-ink-soft">{e.schedule.teacher.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-ink-soft mb-1">เวลาเรียน</p>
                  {e.schedule ? (
                    <p className="font-medium">
                      วัน{dayOfWeekLabel(e.schedule.dayOfWeek)}<br />
                      {e.schedule.startTime}–{e.schedule.endTime} น.
                    </p>
                  ) : (
                    <p className="text-ink-soft">รอยืนยันตาราง</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {user?.branch?.rooms && user.branch.rooms.length > 0 && (
        <div>
          <h3 className="font-display text-lg mb-4">ห้องทั้งหมดของ{user.branch.name}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.branch.rooms.map((room) => (
              <div key={room.id} className="border border-line rounded-md p-4 bg-white">
                <p className="font-medium">{room.name}</p>
                <p className="text-xs text-ink-soft mt-1">รองรับ {room.capacity} คน</p>
                {room.description && (
                  <p className="text-xs text-ink-soft mt-1">{room.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
