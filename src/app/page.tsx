import Link from "next/link";
import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatCurrency, formatThaiDate, LEVEL_LABELS } from "@/lib/format";

export default async function HomePage() {
  const [featuredCourses, branches, latestArticles] = await Promise.all([
    db.query.courses.findMany({
      where: eq(schema.courses.isActive, true),
      with: { branch: true },
      limit: 3,
    }),
    db.query.branches.findMany({ limit: 3 }),
    db.query.articles.findMany({
      where: eq(schema.articles.published, true),
      orderBy: [desc(schema.articles.createdAt)],
      limit: 3,
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div>
          <p className="text-sm tracking-wide text-brass mb-4">
            เปิดสอนเปียโน · กีตาร์ · ร้องเพลง · กลอง · ไวโอลิน
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.15] text-ink max-w-xl">
            พื้นที่ฝึกฝนดนตรี
            <br />
            ของคนทุกวัยในกรุงเทพฯ
          </h1>
          <p className="mt-6 text-ink-soft leading-relaxed max-w-md">
            เรียนตัวต่อตัวกับครูมืออาชีพ ในห้องซ้อมกันเสียงคุณภาพ
            เลือกวันเวลาที่สะดวก จองคอร์ส ติดตามผลการเรียน
            และชำระเงินออนไลน์ได้ในที่เดียว
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="rounded-full bg-burgundy text-ivory px-6 py-3 text-sm font-medium hover:bg-burgundy-deep transition-colors"
            >
              ดูคอร์สเรียนทั้งหมด
            </Link>
            <Link
              href="/branches"
              className="rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-burgundy hover:text-burgundy transition-colors"
            >
              ดูสาขาใกล้บ้าน
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="staff-lines rounded-lg border border-line bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            {/* โลโก้ My Studio */}
            <div className="flex justify-center mb-5">
              <Image
                src="https://i.ibb.co/3ynhWqwj/my-studio-logo.png"
                alt="My Studio Logo"
                width={180}
                height={100}
                className="object-contain"
              />
            </div>
            <p className="text-xs tracking-wide text-ink-soft mb-4">
              คอร์สเปิดสอนสัปดาห์นี้
            </p>
            <ul className="space-y-4">
              {featuredCourses.map((course) => (
                <li key={course.id} className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="font-display text-lg text-ink">{course.title}</p>
                    <p className="text-xs text-ink-soft">{course.branch?.name}</p>
                  </div>
                  <span className="text-sm text-brass shrink-0">
                    {formatCurrency(course.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-brass-soft/60 -z-10" />
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 border-t border-line">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl">คอร์สแนะนำ</h2>
          <Link href="/courses" className="text-sm text-burgundy hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ivory-deep">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : null}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg leading-snug">{course.title}</p>
                  <p className="text-xs text-ink-soft mt-1">
                    {course.instrument} · {LEVEL_LABELS[course.level]} ·{" "}
                    {course.branch?.name}
                  </p>
                </div>
                <span className="text-sm text-brass shrink-0">
                  {formatCurrency(course.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="bg-ivory-deep border-y border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
          <h2 className="font-display text-2xl sm:text-3xl mb-8">สาขาของเรา</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-ivory rounded-md border border-line p-6">
                <p className="font-display text-xl">{branch.name}</p>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                  {branch.address}
                </p>
                <p className="text-sm text-ink-soft mt-1">{branch.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl">ข่าวสารล่าสุด</h2>
          <Link href="/news" className="text-sm text-burgundy hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="group block">
              <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-ivory-deep">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : null}
              </div>
              <p className="text-xs text-ink-soft mt-3">
                {formatThaiDate(article.createdAt)}
              </p>
              <p className="font-display text-lg mt-1 leading-snug">{article.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
