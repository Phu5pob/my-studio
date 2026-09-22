import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export default async function BranchesPage() {
  const branches = await db.query.branches.findMany();
  const courseCounts = await Promise.all(
    branches.map((b) =>
      db.query.courses
        .findMany({ where: eq(schema.courses.branchId, b.id) })
        .then((c) => c.length)
    )
  );

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
      <p className="text-sm tracking-wide text-brass mb-3">สาขาของเรา</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-10 max-w-lg">
        เลือกสาขาที่สะดวกใกล้บ้านคุณ
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {branches.map((branch, i) => (
          <div key={branch.id} className="border border-line rounded-md overflow-hidden bg-white">
            <div className="relative aspect-[16/10] bg-ivory-deep">
              {branch.imageUrl ? (
                <Image src={branch.imageUrl} alt={branch.name} fill className="object-cover" />
              ) : null}
            </div>
            <div className="p-6">
              <p className="font-display text-xl">{branch.name}</p>
              <p className="text-sm text-ink-soft mt-2 leading-relaxed">{branch.address}</p>
              <p className="text-sm text-ink-soft mt-1">{branch.phone}</p>
              {branch.description ? (
                <p className="text-sm text-ink-soft mt-3 leading-relaxed">
                  {branch.description}
                </p>
              ) : null}
              <div className="mt-5 pt-5 border-t border-line flex items-center justify-between">
                <span className="text-xs text-ink-soft">
                  {courseCounts[i]} คอร์สที่เปิดสอน
                </span>
                <Link
                  href={`/courses?branch=${branch.id}`}
                  className="text-sm text-burgundy hover:underline"
                >
                  ดูคอร์สเรียน →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
