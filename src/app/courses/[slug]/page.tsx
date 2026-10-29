
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db, schema } from "@/db";
import {
  formatCurrency,
  LEVEL_LABELS,
  dayOfWeekLabel,
} from "@/lib/format";
import { getSession } from "@/lib/auth";
import { BookingForm } from "@/components/booking-form";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  // รองรับ Slug ภาษาไทยและ URL-encoded
  let decodedSlug: string;

  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    notFound();
  }

  // ค้นหาคอร์สด้วย Slug
  const course = await db.query.courses.findFirst({
    where: eq(schema.courses.slug, decodedSlug),
    with: {
      branch: true,
      schedules: {
        with: {
          teacher: true,
          room: true,
        },
      },
    },
  });

  // ไม่พบคอร์สในฐานข้อมูล
  if (!course) {
    notFound();
  }

  // ตรวจสอบผู้ใช้งาน
  const session = await getSession();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
      {/* ปุ่มกลับ */}
      <Link
        href="/courses"
        className="text-sm text-ink-soft hover:text-burgundy"
      >
        ← กลับไปหน้าคอร์สเรียน
      </Link>

      <div className="mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
        {/* รายละเอียดคอร์ส */}
        <div>
          {/* รูปภาพคอร์ส */}
          <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-ivory-deep">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          {/* ประเภทและระดับ */}
          <p className="text-sm text-brass mt-6">
            {course.instrument} · {LEVEL_LABELS[course.level]}
          </p>

          {/* ชื่อคอร์ส */}
          <h1 className="font-display text-3xl sm:text-4xl mt-2">
            {course.title}
          </h1>

          {/* สาขา */}
          <p className="text-sm text-ink-soft mt-2">
            {course.branch?.name} · {course.branch?.address}
          </p>

          {/* รายละเอียด */}
          <p className="mt-6 text-ink-soft leading-relaxed max-w-2xl">
            {course.description}
          </p>

          {/* ตารางเรียน */}
          {course.schedules.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl mb-4">
                ตารางเรียน
              </h2>

              <div className="border-t border-line">
                {course.schedules.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-4 border-b border-line text-sm"
                  >
                    <span>
                      วัน{dayOfWeekLabel(s.dayOfWeek)}
                    </span>

                    <span className="text-ink-soft">
                      {s.startTime}–{s.endTime} น.
                    </span>

                    <span className="text-ink-soft">
                      ครู {s.teacher?.name ?? "-"}
                    </span>

                    <span className="text-ink-soft">
                      {s.room?.name ?? "-"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* กล่องจองคอร์ส */}
        <aside className="lg:sticky lg:top-24 h-fit border border-line rounded-md p-6 bg-white">
          <p className="text-xs text-ink-soft">
            ค่าเรียนตลอดคอร์ส
          </p>

          <p className="font-display text-3xl text-burgundy mt-1">
            {formatCurrency(course.price)}
          </p>

          <p className="text-xs text-ink-soft mt-1">
            ระยะเวลา {course.durationWeeks} สัปดาห์
          </p>

          <div className="mt-6 pt-6 border-t border-line">
            {session ? (
              session.role === "admin" ||
              session.role === "teacher" ? (
                <p className="text-sm text-ink-soft">
                  บัญชีนี้ไม่สามารถจองคอร์สได้
                </p>
              ) : (
                <BookingForm
                  courseId={course.id}
                  schedules={course.schedules.map((s) => ({
                    id: s.id,
                    teacherName:
                      s.teacher?.name ?? "ยังไม่กำหนดครู",
                    dayOfWeek: s.dayOfWeek,
                    startTime: s.startTime,
                    endTime: s.endTime,
                    room: s.room?.name ?? null,
                  }))}
                />
              )
            ) : (
              <div>
                <p className="text-sm text-ink-soft mb-4">
                  เข้าสู่ระบบเพื่อจองคอร์สเรียนนี้
                </p>

                <Link
                  href={`/login?next=${encodeURIComponent(
                    `/courses/${course.slug}`
                  )}`}
                  className="block text-center rounded-full bg-burgundy text-white px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors"
                >
                  เข้าสู่ระบบเพื่อจอง
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
