import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import {
  formatCurrency,
  ENROLLMENT_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  dayOfWeekLabel,
} from "@/lib/format";
import { StatusBadge } from "@/components/ui";

export default async function DashboardOverviewPage() {
  const session = await getSession();
  if (!session) return null;

  const [enrollments, payments, progress] = await Promise.all([
    db.query.enrollments.findMany({
      where: eq(schema.enrollments.userId, session.userId),
      with: { course: true, schedule: true },
    }),
    db.query.payments.findMany({
      where: eq(schema.payments.userId, session.userId),
    }),
    db.query.progressRecords.findMany({
      where: eq(schema.progressRecords.userId, session.userId),
      with: { course: true },
    }),
  ]);

  const outstanding = payments.filter((p) => p.status === "pending");
  const activeEnrollments = enrollments.filter((e) => e.status !== "cancelled");

  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-3 gap-6">
        <StatCard label="คอร์สที่กำลังเรียน" value={String(activeEnrollments.length)} />
        <StatCard
          label="ยอดค้างชำระ"
          value={formatCurrency(outstanding.reduce((s, p) => s + p.amount, 0))}
          accent={outstanding.length > 0}
        />
        <StatCard label="บันทึกผลการเรียน" value={String(progress.length)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">คอร์สของฉัน</h2>
          <Link href="/dashboard/bookings" className="text-sm text-burgundy hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        {activeEnrollments.length === 0 ? (
          <EmptyState
            title="ยังไม่มีคอร์สที่จอง"
            action={{ href: "/courses", label: "เลือกคอร์สเรียน" }}
          />
        ) : (
          <div className="border-t border-line">
            {activeEnrollments.slice(0, 3).map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-4 py-4 border-b border-line"
              >
                <div>
                  <p className="font-medium">{e.course.title}</p>
                  {e.schedule ? (
                    <p className="text-xs text-ink-soft mt-0.5">
                      วัน{dayOfWeekLabel(e.schedule.dayOfWeek)} {e.schedule.startTime}–
                      {e.schedule.endTime} น.
                    </p>
                  ) : null}
                </div>
                <StatusBadge status={e.status} label={ENROLLMENT_STATUS_LABELS[e.status]} />
              </div>
            ))}
          </div>
        )}
      </div>

      {outstanding.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">รายการที่ต้องชำระเงิน</h2>
            <Link href="/dashboard/payments" className="text-sm text-burgundy hover:underline">
              ไปหน้าชำระเงิน
            </Link>
          </div>
          <div className="border-t border-line">
            {outstanding.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 py-4 border-b border-line"
              >
                <div>
                  <p className="font-medium">{p.invoiceNo}</p>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {formatCurrency(p.amount)}
                  </p>
                </div>
                <StatusBadge status={p.status} label={PAYMENT_STATUS_LABELS[p.status]} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-line rounded-md p-5 bg-white">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className={`font-display text-2xl mt-2 ${accent ? "text-burgundy" : ""}`}>{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  action,
}: {
  title: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="border border-dashed border-line rounded-md p-8 text-center">
      <p className="text-sm text-ink-soft mb-4">{title}</p>
      <Link
        href={action.href}
        className="text-sm rounded-full bg-burgundy text-ivory px-5 py-2 hover:bg-burgundy-deep transition-colors"
      >
        {action.label}
      </Link>
    </div>
  );
}
