import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <span className="font-display text-xl text-burgundy">My Studio</span>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-xs">
              โรงเรียนสอนดนตรีสำหรับทุกวัย เปิดสอนเปียโน กีตาร์ ร้องเพลง กลอง และไวโอลิน
              สาขาพัทลุง ตรัง และนครศรีธรรมราช
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-ink-soft mb-3">เมนู</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-burgundy">คอร์สเรียน</Link></li>
              <li><Link href="/branches" className="hover:text-burgundy">สาขา</Link></li>
              <li><Link href="/news" className="hover:text-burgundy">ข่าวสาร</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-wide text-ink-soft mb-3">ติดต่อเรา</p>
            <ul className="space-y-2 text-sm text-ink-soft">
              <li>โทร 080-235-4146</li>
              <li>info@mystudio.example</li>
              <li>เปิดทุกวัน 9:00–20:00 น.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-line text-xs text-ink-soft">
          © {new Date().getFullYear()} My Studio โรงเรียนสอนดนตรี
        </div>
      </div>
    </footer>
  );
}
