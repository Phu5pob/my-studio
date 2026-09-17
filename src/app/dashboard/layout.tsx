import Link from "next/link";
import { getSession } from "@/lib/auth";

const LINKS = [
  { href: "/dashboard", label: "ภาพรวม" },
  { href: "/dashboard/bookings", label: "การจองของฉัน" },
  { href: "/dashboard/rooms", label: "ห้องเรียนของฉัน" },
  { href: "/dashboard/payments", label: "การชำระเงิน" },
  { href: "/dashboard/progress", label: "ผลการเรียน" },
];

export default async function DashboardLayout({ children }: LayoutProps) {
  const session = await getSession();
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <p className="text-sm text-ink-soft">สวัสดี</p>
      <h1 className="font-display text-2xl sm:text-3xl mb-8">{session?.name}</h1>
      <div className="grid lg:grid-cols-[200px_1fr] gap-10">
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-line pb-3 lg:pb-0 lg:pr-6">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-ink-soft hover:text-burgundy whitespace-nowrap px-1 py-1.5">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
