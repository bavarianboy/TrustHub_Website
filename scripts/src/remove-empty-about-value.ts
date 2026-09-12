// One-time content fix: removes a stray empty 4th entry (title/desc both "")
// from the About page's Vision & Values list (EN+AR) — added accidentally via
// the admin panel at some point and never filled in. Confirmed live via
// GET /api/page-content/about?locale=en before running this. Patches only the
// `values` field on the existing page_content rows — everything else in the
// JSONB blob is left untouched. Run once, then edit through the admin panel,
// not by re-running this script.
import { eq, and } from "drizzle-orm";
import { db, pageContentTable, pool } from "@workspace/db";

const EMPTY_INDEX = 3;

for (const locale of ["en", "ar"] as const) {
  const [row] = await db
    .select()
    .from(pageContentTable)
    .where(and(eq(pageContentTable.page, "about"), eq(pageContentTable.locale, locale)))
    .limit(1);

  if (!row) {
    console.error(`No about/${locale} row found.`);
    process.exit(1);
  }

  const existing = row.content as Record<string, unknown>;
  const values = existing.values as { title: string; desc: string }[];
  const target = values[EMPTY_INDEX];

  if (!target || target.title !== "" || target.desc !== "") {
    console.error(
      `about/${locale}: values[${EMPTY_INDEX}] isn't the expected empty entry (got ${JSON.stringify(target)}) — aborting without changes.`,
    );
    process.exit(1);
  }

  const newValues = values.filter((_, i) => i !== EMPTY_INDEX);
  const content = { ...existing, values: newValues };

  await db
    .update(pageContentTable)
    .set({ content, updatedAt: new Date() })
    .where(eq(pageContentTable.id, row.id));

  console.log(`Updated about/${locale}: values ${values.length} -> ${newValues.length}`);
}

await pool.end();
