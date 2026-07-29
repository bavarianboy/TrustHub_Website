// One-time migration: moves About/Services/Workspace content out of the
// static i18n locale files and into the page_content table, so it becomes
// admin-editable. Reads directly from the locale JSON — run once, then edit
// through the admin panel, not by re-running this script.
import { readFileSync } from "node:fs";
import path from "node:path";
import { eq, and } from "drizzle-orm";
import { db, pageContentTable, pool } from "@workspace/db";

const localesDir = path.resolve(
  import.meta.dirname,
  "../../artifacts/trust-hub/src/i18n/locales",
);

const PAGES = ["about", "services", "workspace"] as const;
const LOCALES = ["en", "ar"] as const;

for (const locale of LOCALES) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf-8"));

  for (const page of PAGES) {
    const content = data[page];
    if (!content) {
      console.error(`Missing "${page}" key in ${locale}.json`);
      process.exit(1);
    }

    const [existing] = await db
      .select({ id: pageContentTable.id })
      .from(pageContentTable)
      .where(and(eq(pageContentTable.page, page), eq(pageContentTable.locale, locale)))
      .limit(1);

    if (existing) {
      await db.update(pageContentTable).set({ content, updatedAt: new Date() }).where(eq(pageContentTable.id, existing.id));
      console.log(`Updated ${page}/${locale}`);
    } else {
      await db.insert(pageContentTable).values({ page, locale, content });
      console.log(`Inserted ${page}/${locale}`);
    }
  }
}

await pool.end();
