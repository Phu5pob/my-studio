import { db } from "@/db";
import { formatThaiDate, dayOfWeekLabel, ENROLLMENT_STATUS_LABELS } from "@/lib/format";
import { updateEnrollmentStatusAction } from "@/lib/actions/enrollments";
import { StatusSelectForm } from "@/components/admin/status-select-form";

const STATUS_OPTIONS = Object.entries(ENROLLMENT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default async function AdminBookingsPage() {
  const enrollments = await db.query.enrollments.findMany({
    with: { user: true, course: { with: { branch: true } }, schedule: true },
    orderBy: (e, { desc }) => [desc(e.createdAt)],
  });

  return (
    <div>
      <h2 className="font-display text-xl mb-4">การจองทั้งหมด ({enrollments.length})</h2>
      <div className="space-y-3">
        {enrollments.map((e) => (
          <div
            key={e.id}
            className="border border-line rounded-md p-4 bg-white flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <p className="font-medium">{e.course.title}</p>
              <p className="text-xs text-ink-soft mt-1">
                {e.user.name} · {e.user.email} · {e.course.branch?.name}
              </p>
              {e.schedule ? (
                <p className="text-xs text-ink-soft mt-1">
                  วัน{dayOfWeekLabel(e.schedule.dayOfWeek)} {e.schedule.startTime}–
                  {e.schedule.endTime} น.
                </p>
              ) : null}
              <p className="text-xs text-ink-soft mt-1">
                จองเมื่อ {formatThaiDate(e.createdAt)}
              </p>
            </div>
            <StatusSelectForm
              action={updateEnrollmentStatusAction}
              id={e.id}
              currentStatus={e.status}
              options={STATUS_OPTIONS}
            />
          </div>
        ))}
        {enrollments.length === 0 ? (
          <p className="text-sm text-ink-soft">ยังไม่มีการจองในระบบ</p>
        ) : null}
      </div>
    </div>
  );
}
