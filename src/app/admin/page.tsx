import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatCurrency } from "@/lib/format";

export default async function AdminOverviewPage() {
  const [branches, courses, students, enrollments, payments] = await Promise.all([
    db.query.branches.findMany(),
    db.query.courses.findMany(),
    db.query.users.findMany({ where: eq(schema.users.role, "student") }),
    db.query.enrollments.findMany(),
    db.query.payments.findMany(),
  ]);

  const pendingEnrollments = enrollments.filter((e) => e.status === "pending").length;
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const revenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard label="สาขาทั้งหมด" value={String(branches.length)} />
      <StatCard label="คอร์สเรียนทั้งหมด" value={String(courses.length)} />
      <StatCard label="นักเรียนทั้งหมด" value={String(students.length)} />
      <StatCard
        label="การจองที่รอดำเนินการ"
        value={String(pendingEnrollments)}
        accent={pendingEnrollments > 0}
      />
      <StatCard
        label="ยอดค้างชำระ"
        value={`${pendingPayments.length} รายการ · ${formatCurrency(
          pendingPayments.reduce((s, p) => s + p.amount, 0)
        )}`}
        accent={pendingPayments.length > 0}
      />
      <StatCard label="รายได้ที่ชำระแล้ว" value={formatCurrency(revenue)} />
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
      <p className={`font-display text-xl mt-2 ${accent ? "text-burgundy" : ""}`}>{value}</p>
    </div>
  );
}
