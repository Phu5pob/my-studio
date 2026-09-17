import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatThaiDate } from "@/lib/format";

export default async function NewsPage() {
  const articles = await db.query.articles.findMany({
    where: eq(schema.articles.published, true),
    orderBy: [desc(schema.articles.createdAt)],
    with: { branch: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
      <p className="text-sm tracking-wide text-brass mb-3">ข่าวสาร</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-10 max-w-lg">
        ความเคลื่อนไหวของโรงเรียน
      </h1>

      {articles.length === 0 ? (
        <p className="text-ink-soft">ยังไม่มีข่าวสารในขณะนี้</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
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
                {article.branch ? ` · ${article.branch.name}` : " · ทุกสาขา"}
              </p>
              <p className="font-display text-lg mt-1 leading-snug">{article.title}</p>
              {article.excerpt ? (
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">
                  {article.excerpt}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
