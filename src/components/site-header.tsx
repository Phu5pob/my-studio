"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { SessionPayload } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const NAV_LINKS = [
  { href: "/courses", label: "คอร์สเรียน" },
  { href: "/branches", label: "สาขา" },
  { href: "/news", label: "ข่าวสาร" },
];

function getPortalLink(session: SessionPayload | null) {
  if (!session) return null;
  if (session.role === "admin") return { href: "/admin", label: "แผงแอดมิน" };
  if (session.role === "teacher") return { href: "/teacher", label: "พอร์ทัลครู" };
  return { href: "/dashboard", label: "แดชบอร์ด" };
}

export function SiteHeader({ session }: { session: SessionPayload | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const portal = getPortalLink(session);

  return (
    <header className="border-b border-line bg-white sticky top-0 z-40 shadow-sm">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2 shrink-0">
            <span className="font-display text-2xl tracking-tight text-burgundy">My Studio</span>
            <span className="hidden sm:inline text-[11px] tracking-wide text-ink-soft">โรงเรียนสอนดนตรี</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={`text-sm transition-colors hover:text-burgundy ${pathname.startsWith(link.href) ? "text-burgundy font-medium" : "text-ink-soft"}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                {portal && (
                  <Link href={portal.href} className="text-sm text-ink-soft hover:text-burgundy transition-colors">
                    {session.role === "teacher" ? `สวัสดี ${session.name}` : portal.label}
                  </Link>
                )}
                <form action={logoutAction}>
                  <button className="text-sm rounded-full border border-line px-4 py-2 hover:border-burgundy hover:text-burgundy transition-colors">
                    ออกจากระบบ
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-ink-soft hover:text-burgundy transition-colors">เข้าสู่ระบบ</Link>
                <Link href="/register" className="text-sm rounded-full bg-burgundy text-white px-4 py-2 hover:bg-burgundy-deep transition-colors">
                  สมัครเรียน
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 -mr-2 text-ink" onClick={() => setOpen((v) => !v)} aria-label="เปิดเมนู">
            <span className="block w-6 h-px bg-ink mb-1.5" />
            <span className="block w-6 h-px bg-ink mb-1.5" />
            <span className="block w-4 h-px bg-ink" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line px-5 py-4 flex flex-col gap-4 bg-white">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-ink-soft">{link.label}</Link>
          ))}
          <div className="h-px bg-line" />
          {session && portal ? (
            <>
              <Link href={portal.href} onClick={() => setOpen(false)} className="text-sm text-burgundy">{portal.label}</Link>
              <form action={logoutAction}><button className="text-sm text-ink-soft">ออกจากระบบ</button></form>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm">เข้าสู่ระบบ</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="text-sm text-burgundy font-medium">สมัครเรียน</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
