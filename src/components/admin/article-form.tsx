"use client";

import { useActionState } from "react";
import { createArticleAction, updateArticleAction } from "@/lib/actions/articles";
import { SubmitButton } from "@/components/ui";

type Branch = { id: number; name: string };
type Article = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  branchId: number | null;
  published: boolean;
};

export function ArticleForm({ branches, article }: { branches: Branch[]; article?: Article }) {
  const action = article ? updateArticleAction : createArticleAction;
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}

      <div>
        <label className="block text-sm text-ink-soft mb-1.5">หัวข้อข่าว</label>
        <input
          name="title"
          defaultValue={article?.title}
          required
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">สาขาที่เกี่ยวข้อง</label>
          <select
            name="branchId"
            defaultValue={article?.branchId ?? ""}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          >
            <option value="">ทุกสาขา</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink-soft mb-1.5">ลิงก์ภาพหน้าปก (URL)</label>
          <input
            name="coverImage"
            defaultValue={article?.coverImage ?? ""}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1.5">คำโปรย (แสดงในหน้ารวม)</label>
        <input
          name="excerpt"
          defaultValue={article?.excerpt ?? ""}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-1.5">เนื้อหาข่าว</label>
        <textarea
          name="content"
          defaultValue={article?.content}
          required
          rows={5}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="published"
          defaultChecked={article?.published ?? true}
          className="rounded border-line"
        />
        เผยแพร่ข่าวนี้ทันที
      </label>

      <SubmitButton pendingText="กำลังบันทึก…">
        {article ? "บันทึกการแก้ไข" : "เพิ่มข่าวสาร"}
      </SubmitButton>
    </form>
  );
}
