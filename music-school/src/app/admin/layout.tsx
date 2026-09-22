import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "ภาพรวม" },
  { href: "/admin/branches", label: "สาขา" },
  { href: "/admin/rooms", label: "ห้องเรียน" },
  { href: "/admin/teachers", label: "ครูผู้สอน" },
  { href: "/admin/courses", label: "คอร์สเรียน" },
  { href: "/admin/students", label: "นักเรียน" },
  { href: "/admin/bookings", label: "การจอง" },
  { href: "/admin/payments", label: "การชำระเงิน" },
  { href: "/admin/progress", label: "ผลการเรียน" },
  { href: "/admin/news", label: "ข่าวสาร" },
];

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <p className="text-sm tracking-wide text-brass mb-1">แผงควบคุมแอดมิน</p>
      <h1 className="font-display text-2xl sm:text-3xl mb-8">จัดการ My Studio</h1>
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
