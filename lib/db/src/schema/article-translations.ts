import { pgTable, text, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { articlesTable } from "./articles";
import { localeEnum } from "./leads";

// Translations live in their own table keyed by (articleId, locale) rather than
// as title_en/title_ar columns, so adding a third language is a data change,
// not a schema migration.
export const articleTranslationsTable = pgTable(
  "article_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articlesTable.id, { onDelete: "cascade" }),
    locale: localeEnum("locale").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull(),
  },
  (table) => [uniqueIndex("article_translations_article_locale_idx").on(table.articleId, table.locale)],
);

export const insertArticleTranslationSchema = createInsertSchema(articleTranslationsTable).omit({
  id: true,
});
export type InsertArticleTranslation = z.infer<typeof insertArticleTranslationSchema>;
export type ArticleTranslation = typeof articleTranslationsTable.$inferSelect;
