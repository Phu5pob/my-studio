import { db } from "@/db";
import { formatCurrency, formatThaiDate, PAYMENT_STATUS_LABELS } from "@/lib/format";
import { updatePaymentStatusAction } from "@/lib/actions/payments";
import { StatusSelectForm } from "@/components/admin/status-select-form";

const STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default async function AdminPaymentsPage() {
  const payments = await db.query.payments.findMany({
    with: { user: true, enrollment: { with: { course: true } } },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">การชำระเงินทั้งหมด ({payments.length})</h2>
        <p className="text-sm text-ink-soft">
          รวมชำระแล้ว <span className="text-burgundy font-medium">{formatCurrency(totalPaid)}</span>
        </p>
      </div>
      <div className="space-y-3">
        {payments.map((p) => (
          <div
            key={p.id}
            className="border border-line rounded-md p-4 bg-white flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <p className="font-medium">
                {p.invoiceNo} · {formatCurrency(p.amount)}
              </p>
              <p className="text-xs text-ink-soft mt-1">
                {p.user.name} · {p.enrollment?.course.title ?? "-"}
              </p>
              <p className="text-xs text-ink-soft mt-1">
                ออกใบแจ้งหนี้เมื่อ {formatThaiDate(p.createdAt)}
              </p>
              {p.slipUrl ? (
                <a
                  href={p.slipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-burgundy hover:underline mt-1 inline-block"
                >
                  ดูสลิปที่แนบ →
                </a>
              ) : null}
            </div>
            <StatusSelectForm
              action={updatePaymentStatusAction}
              id={p.id}
              currentStatus={p.status}
              options={STATUS_OPTIONS}
            />
          </div>
        ))}
        {payments.length === 0 ? (
          <p className="text-sm text-ink-soft">ยังไม่มีรายการชำระเงิน</p>
        ) : null}
      </div>

      <div className="mt-8 border border-line rounded-md p-5 bg-ivory-deep text-xs text-ink-soft leading-relaxed">
        ระบบนี้เป็นการจำลองขั้นตอนแจ้งชำระเงิน/ตรวจสอบสลิปด้วยตนเอง
        หากต้องการรับชำระเงินจริงผ่านบัตรเครดิตหรือพร้อมเพย์อัตโนมัติ
        แนะนำให้เชื่อมต่อผู้ให้บริการชำระเงิน เช่น Omise, 2C2P หรือ Stripe
      </div>
    </div>
  );
}
