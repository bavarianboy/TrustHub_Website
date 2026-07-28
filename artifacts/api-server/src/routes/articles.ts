import { Router, type IRouter } from "express";
import { and, eq, desc } from "drizzle-orm";
import { db, articlesTable, articleTranslationsTable } from "@workspace/db";
import {
  ListArticlesQueryParams,
  ListArticlesResponse,
  GetArticleBySlugQueryParams,
  GetArticleBySlugResponse,
} from "@workspace/api-zod";
import { HttpError } from "../middlewares/error-handler";
import { requireParam } from "../lib/params";

const router: IRouter = Router();

router.get("/articles", async (req, res) => {
  const parsedQuery = ListArticlesQueryParams.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new HttpError(400, "locale query parameter must be 'en' or 'ar'");
  }

  const { locale, category } = parsedQuery.data;

  const rows = await db
    .select({
      id: articlesTable.id,
      slug: articlesTable.slug,
      category: articlesTable.category,
      coverImage: articlesTable.coverImage,
      featured: articlesTable.featured,
      publishedAt: articlesTable.publishedAt,
      title: articleTranslationsTable.title,
      excerpt: articleTranslationsTable.excerpt,
    })
    .from(articlesTable)
    .innerJoin(
      articleTranslationsTable,
      and(eq(articleTranslationsTable.articleId, articlesTable.id), eq(articleTranslationsTable.locale, locale)),
    )
    .where(
      category
        ? and(eq(articlesTable.status, "published"), eq(articlesTable.category, category))
        : eq(articlesTable.status, "published"),
    )
    .orderBy(desc(articlesTable.publishedAt));

  res.json(ListArticlesResponse.parse(rows));
});

router.get("/articles/:slug", async (req, res) => {
  const parsedQuery = GetArticleBySlugQueryParams.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new HttpError(400, "locale query parameter must be 'en' or 'ar'");
  }

  const { locale } = parsedQuery.data;

  const [row] = await db
    .select({
      id: articlesTable.id,
      slug: articlesTable.slug,
      category: articlesTable.category,
      coverImage: articlesTable.coverImage,
      featured: articlesTable.featured,
      publishedAt: articlesTable.publishedAt,
      status: articlesTable.status,
      title: articleTranslationsTable.title,
      excerpt: articleTranslationsTable.excerpt,
      body: articleTranslationsTable.body,
    })
    .from(articlesTable)
    .innerJoin(
      articleTranslationsTable,
      and(eq(articleTranslationsTable.articleId, articlesTable.id), eq(articleTranslationsTable.locale, locale)),
    )
    .where(and(eq(articlesTable.slug, requireParam(req, "slug")), eq(articlesTable.status, "published")))
    .limit(1);

  if (!row) {
    throw new HttpError(404, "Article not found");
  }

  res.json(GetArticleBySlugResponse.parse(row));
});

export default router;
