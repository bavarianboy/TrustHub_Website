import { pgTable, text, uuid, timestamp, pgEnum, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { localeEnum } from "./leads";

// About/Services/Workspace are marketing pages with a fixed, page-specific
// shape (validated at the API layer by a dedicated Zod schema per page — see
// artifacts/api-server/src/routes/page-content.ts) rather than a generic
// CMS shape. A JSONB blob per (page, locale) avoids a dozen new relational
// tables for content that is only ever rendered, never queried/filtered.
export const pageContentPageEnum = pgEnum("page_content_page", [
  "about",
  "services",
  "workspace",
  "privacy",
  "terms",
  "contact",
  "company-formation",
  "business-incubators-accelerators",
  "programs",
  "incubator-program",
  "accelerator-program",
]);

export const pageContentTable = pgTable(
  "page_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    page: pageContentPageEnum("page").notNull(),
    locale: localeEnum("locale").notNull(),
    content: jsonb("content").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("page_content_page_locale_idx").on(table.page, table.locale)],
);

export type PageContentRow = typeof pageContentTable.$inferSelect;
