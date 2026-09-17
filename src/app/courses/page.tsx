import Image from "next/image";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatCurrency, LEVEL_LABELS } from "@/lib/format";

export default async function CoursesPage({
  searchParams,
}: PageProps<"/courses">) {
  const params = await searchParams;
  const branchId = typeof params.branch === "string" ? Number(params.branch) : undefined;
  const instrument = typeof params.instrument === "string" ? params.instrument : undefined;

  const [branches, allCourses] = await Promise.all([
    db.query.branches.findMany(),
    db.query.courses.findMany({
      where: eq(schema.courses.isActive, true),
      with: { branch: true },
    }),
  ]);

  const instruments = Array.from(new Set(allCourses.map((c) => c.instrument)));

  const courses = allCourses.filter((c) => {
    if (branchId && c.branchId !== branchId) return false;
    if (instrument && c.instrument !== instrument) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
      <p className="text-sm tracking-wide text-brass mb-3">คอร์สเรียน</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-10 max-w-lg">
        เลือกคอร์สที่ใช่สำหรับคุณ
      </h1>

      <div className="flex flex-wrap gap-3 mb-10">
        <FilterLink
          href="/courses"
          label="ทุกสาขา"
          active={!branchId}
        />
        {branches.map((b) => (
          <FilterLink
            key={b.id}
            href={`/courses?branch=${b.id}${instrument ? `&instrument=${instrument}` : ""}`}
            label={b.name}
            active={branchId === b.id}
          />
        ))}
        <span className="text-line px-1 self-center">|</span>
        <FilterLink
          href={`/courses${branchId ? `?branch=${branchId}` : ""}`}
          label="ทุกเครื่องดนตรี"
          active={!instrument}
        />
        {instruments.map((inst) => (
          <FilterLink
            key={inst}
            href={`/courses?${branchId ? `branch=${branchId}&` : ""}instrument=${inst}`}
            label={inst}
            active={instrument === inst}
          />
        ))}
      </div>

      {courses.length === 0 ? (
        <p className="text-ink-soft">ยังไม่มีคอร์สในหมวดที่เลือก ลองเปลี่ยนตัวกรองดูนะครับ</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`} className="group block">
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
      )}
    </div>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${
        active
          ? "border-burgundy bg-burgundy text-ivory"
          : "border-line text-ink-soft hover:border-burgundy hover:text-burgundy"
      }`}
    >
      {label}
    </Link>
  );
}
