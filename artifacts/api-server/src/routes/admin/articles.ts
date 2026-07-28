import { Router, type IRouter } from "express";
import { eq, inArray } from "drizzle-orm";
import { db, articlesTable, articleTranslationsTable, type Article, type ArticleTranslation } from "@workspace/db";
import {
  AdminListArticlesResponse,
  AdminCreateArticleBody,
  AdminCreateArticleResponse,
  AdminUpdateArticleBody,
  AdminUpdateArticleResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../../middlewares/require-auth";
import { validateBody } from "../../middlewares/validate";
import { HttpError } from "../../middlewares/error-handler";
import { requireParam } from "../../lib/params";

const router: IRouter = Router();

router.use(requireAuth);

function toAdminArticle(article: Article, translations: ArticleTranslation[]) {
  return {
    ...article,
    translations: translations.map(({ locale, title, excerpt, body }) => ({ locale, title, excerpt, body })),
  };
}

async function loadTranslations(articleIds: string[]): Promise<Map<string, ArticleTranslation[]>> {
  if (articleIds.length === 0) return new Map();

  const rows = await db
    .select()
    .from(articleTranslationsTable)
    .where(inArray(articleTranslationsTable.articleId, articleIds));

  const byArticle = new Map<string, ArticleTranslation[]>();
  for (const row of rows) {
    const existing = byArticle.get(row.articleId) ?? [];
    existing.push(row);
    byArticle.set(row.articleId, existing);
  }
  return byArticle;
}

router.get("/articles", async (_req, res) => {
  const articles = await db.select().from(articlesTable);
  const translationsByArticle = await loadTranslations(articles.map((a) => a.id));

  res.json(
    AdminListArticlesResponse.parse(
      articles.map((article) => toAdminArticle(article, translationsByArticle.get(article.id) ?? [])),
    ),
  );
});

router.post("/articles", validateBody(AdminCreateArticleBody), async (req, res) => {
  const body = req.body as {
    slug: string;
    category: string;
    coverImage?: string;
    featured?: boolean;
    status: "draft" | "published";
    translations: { locale: "en" | "ar"; title: string; excerpt: string; body: string }[];
  };

  const result = await db.transaction(async (tx) => {
    const [article] = await tx
      .insert(articlesTable)
      .values({
        slug: body.slug,
        category: body.category,
        coverImage: body.coverImage,
        featured: body.featured ?? false,
        status: body.status,
        publishedAt: body.status === "published" ? new Date() : null,
      })
      .returning();

    if (!article) throw new HttpError(500, "Failed to create article");

    const translations =
      body.translations.length > 0
        ? await tx
            .insert(articleTranslationsTable)
            .values(body.translations.map((t) => ({ ...t, articleId: article.id })))
            .returning()
        : [];

    return { article, translations };
  });

  res.status(201).json(AdminCreateArticleResponse.parse(toAdminArticle(result.article, result.translations)));
});

router.patch("/articles/:id", validateBody(AdminUpdateArticleBody), async (req, res) => {
  const body = req.body as {
    slug: string;
    category: string;
    coverImage?: string;
    featured?: boolean;
    status: "draft" | "published";
    translations: { locale: "en" | "ar"; title: string; excerpt: string; body: string }[];
  };
  const id = requireParam(req, "id");

  const result = await db.transaction(async (tx) => {
    const [existing] = await tx.select().from(articlesTable).where(eq(articlesTable.id, id)).limit(1);
    if (!existing) return null;

    const [article] = await tx
      .update(articlesTable)
      .set({
        slug: body.slug,
        category: body.category,
        coverImage: body.coverImage,
        featured: body.featured ?? false,
        status: body.status,
        publishedAt: body.status === "published" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articlesTable.id, id))
      .returning();

    if (!article) throw new HttpError(500, "Failed to update article");

    // Full replace-on-write: simpler and safer than diffing individual
    // translation rows, and the editor always submits the complete set.
    await tx.delete(articleTranslationsTable).where(eq(articleTranslationsTable.articleId, id));

    const translations =
      body.translations.length > 0
        ? await tx
            .insert(articleTranslationsTable)
            .values(body.translations.map((t) => ({ ...t, articleId: id })))
            .returning()
        : [];

    return { article, translations };
  });

  if (!result) {
    throw new HttpError(404, "Article not found");
  }

  res.json(AdminUpdateArticleResponse.parse(toAdminArticle(result.article, result.translations)));
});

router.delete("/articles/:id", async (req, res) => {
  const [deleted] = await db.delete(articlesTable).where(eq(articlesTable.id, requireParam(req, "id"))).returning();

  if (!deleted) {
    throw new HttpError(404, "Article not found");
  }

  res.status(204).end();
});

export default router;
