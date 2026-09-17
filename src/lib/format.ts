const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatThaiDate(dateValue: string | Date | null | undefined) {
  if (!dateValue) return "-";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function dayOfWeekLabel(day: number) {
  return THAI_DAYS[day] ?? "-";
}

export const LEVEL_LABELS: Record<string, string> = {
  beginner: "เริ่มต้น",
  intermediate: "ระดับกลาง",
  advanced: "ระดับสูง",
};

export const ENROLLMENT_STATUS_LABELS: Record<string, string> = {
  pending: "รอดำเนินการ",
  confirmed: "ยืนยันแล้ว",
  cancelled: "ยกเลิกแล้ว",
  completed: "เรียนจบแล้ว",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "รอชำระเงิน",
  paid: "ชำระแล้ว",
  failed: "ไม่สำเร็จ",
  refunded: "คืนเงินแล้ว",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "โอนเงินผ่านธนาคาร",
  credit_card: "บัตรเครดิต",
  cash: "เงินสด",
  promptpay: "พร้อมเพย์",
};
