import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatThaiDate } from "@/lib/format";

export default async function NewsDetailPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;

  const article = await db.query.articles.findFirst({
    where: eq(schema.articles.slug, slug),
    with: { branch: true },
  });

  if (!article || !article.published) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16">
      <Link href="/news" className="text-sm text-ink-soft hover:text-burgundy">
        ← กลับไปหน้าข่าวสาร
      </Link>

      <p className="text-xs text-ink-soft mt-6">
        {formatThaiDate(article.createdAt)}
        {article.branch ? ` · ${article.branch.name}` : " · ทุกสาขา"}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl mt-2">{article.title}</h1>

      {article.coverImage ? (
        <div className="relative aspect-[16/9] rounded-md overflow-hidden bg-ivory-deep mt-8">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
        </div>
      ) : null}

      <div className="mt-8 text-ink-soft leading-relaxed whitespace-pre-line max-w-[70ch]">
        {article.content}
      </div>
    </div>
  );
}
