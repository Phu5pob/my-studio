"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./auth";

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9ก-๙\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) || `article-${Date.now()}`
  );
}

const articleSchema = z.object({
  title: z.string().min(2, "กรุณากรอกหัวข้อข่าว"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "กรุณากรอกเนื้อหาข่าวอย่างน้อย 10 ตัวอักษร"),
  coverImage: z.string().optional(),
  branchId: z.string().optional(),
  published: z.coerce.boolean().optional(),
});

export async function createArticleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || "",
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || "",
    branchId: formData.get("branchId") || undefined,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let counter = 1;
  while (await db.query.articles.findFirst({ where: eq(schema.articles.slug, slug) })) {
    slug = `${baseSlug}-${counter++}`;
  }

  await db.insert(schema.articles).values({
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImage: parsed.data.coverImage,
    branchId: parsed.data.branchId ? Number(parsed.data.branchId) : null,
    published: parsed.data.published ?? false,
    authorId: session.userId,
    slug,
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  return null;
}

export async function updateArticleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = Number(formData.get("id"));

  const parsed = articleSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || "",
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || "",
    branchId: formData.get("branchId") || undefined,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  await db
    .update(schema.articles)
    .set({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage,
      branchId: parsed.data.branchId ? Number(parsed.data.branchId) : null,
      published: parsed.data.published ?? false,
    })
    .where(eq(schema.articles.id, id));

  revalidatePath("/admin/news");
  revalidatePath("/news");
  return null;
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await db.delete(schema.articles).where(eq(schema.articles.id, id));
  revalidatePath("/admin/news");
  revalidatePath("/news");
}
