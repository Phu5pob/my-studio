import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSession } from "@/lib/auth";
import {
  formatCurrency,
  formatThaiDate,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/format";
import { StatusBadge } from "@/components/ui";
import { SlipForm } from "@/components/slip-form";

export default async function PaymentsPage() {
  const session = await getSession();
  if (!session) return null;

  const payments = await db.query.payments.findMany({
    where: eq(schema.payments.userId, session.userId),
    with: { enrollment: { with: { course: true } } },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return (
    <div>
      <h2 className="font-display text-xl mb-1">การชำระเงิน</h2>
      <p className="text-sm text-ink-soft mb-6">
        รายการค่าเรียนและใบแจ้งหนี้ของคุณ ชำระผ่านการโอนเงินแล้วแนบสลิปเพื่อให้เจ้าหน้าที่ตรวจสอบ
      </p>

      {payments.length === 0 ? (
        <p className="text-sm text-ink-soft">ยังไม่มีรายการชำระเงิน</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div key={p.id} className="border border-line rounded-md p-5 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{p.invoiceNo}</p>
                  <p className="text-xs text-ink-soft mt-1">
                    {p.enrollment?.course.title ?? "-"}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">
                    วิธีชำระ: {PAYMENT_METHOD_LABELS[p.method]}
                  </p>
                  {p.paidAt ? (
                    <p className="text-xs text-ink-soft mt-1">
                      ชำระเมื่อ {formatThaiDate(p.paidAt)}
                    </p>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="font-display text-lg">{formatCurrency(p.amount)}</p>
                  <div className="mt-1">
                    <StatusBadge status={p.status} label={PAYMENT_STATUS_LABELS[p.status]} />
                  </div>
                </div>
              </div>

              {p.status === "pending" ? (
                <div className="mt-4 pt-4 border-t border-line">
                  {p.slipUrl ? (
                    <p className="text-xs text-ink-soft mb-2">
                      ส่งสลิปแล้ว รอเจ้าหน้าที่ตรวจสอบ —{" "}
                      <a
                        href={p.slipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-burgundy hover:underline"
                      >
                        ดูสลิปที่แนบ
                      </a>
                    </p>
                  ) : null}
                  <SlipForm paymentId={p.id} hasSlip={Boolean(p.slipUrl)} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 border border-line rounded-md p-5 bg-ivory-deep text-sm text-ink-soft leading-relaxed">
        <p className="font-medium text-ink mb-1">ช่องทางการโอนเงิน</p>
        <p>ธนาคารกรุงเทพ สาขาสยามสแควร์</p>
        <p>เลขบัญชี 123-4-56789-0 ชื่อบัญชี My Studio</p>
        <p className="mt-2 text-xs">
          หมายเหตุ: ระบบนี้เป็นตัวอย่างสาธิต ยังไม่ได้เชื่อมต่อเกตเวย์ชำระเงินจริง
          สำหรับใช้งานจริงแนะนำให้เชื่อมต่อผู้ให้บริการ เช่น Omise หรือ 2C2P
        </p>
      </div>
    </div>
  );
}
