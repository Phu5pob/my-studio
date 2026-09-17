import { db } from "@/db";
import { ArticleForm } from "@/components/admin/article-form";
import { deleteArticleAction } from "@/lib/actions/articles";
import { formatThaiDate } from "@/lib/format";

export default async function AdminNewsPage() {
  const [branches, articles] = await Promise.all([
    db.query.branches.findMany(),
    db.query.articles.findMany({
      with: { branch: true },
      orderBy: (a, { desc }) => [desc(a.createdAt)],
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl mb-4">เพิ่มข่าวสารใหม่</h2>
        <div className="border border-line rounded-md p-5 bg-white max-w-2xl">
          <ArticleForm branches={branches} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">ข่าวสารทั้งหมด ({articles.length})</h2>
        <div className="space-y-4">
          {articles.map((article) => (
            <details key={article.id} className="border border-line rounded-md bg-white">
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {article.title}{" "}
                    {!article.published ? (
                      <span className="text-xs text-ink-soft">(ฉบับร่าง)</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">
                    {article.branch?.name ?? "ทุกสาขา"} · {formatThaiDate(article.createdAt)}
                  </p>
                </div>
                <span className="text-xs text-burgundy shrink-0">แก้ไข / ลบ</span>
              </summary>
              <div className="p-5 pt-0 space-y-4">
                <ArticleForm branches={branches} article={article} />
                <form action={deleteArticleAction} className="pt-2">
                  <input type="hidden" name="id" value={article.id} />
                  <button className="text-sm text-danger hover:underline">ลบข่าวนี้</button>
                </form>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
