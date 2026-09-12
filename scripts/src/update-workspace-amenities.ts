// One-time content update: replaces the Workspace page's "Included Amenities"
// list (EN+AR) with the new 9-item list from the client, per the
// Trust-Hub-Services-Content-Guide.md doc (2026-08). Patches only the
// `amenities` field on the existing page_content rows — everything else in
// the JSONB blob is left untouched. Run once, then edit through the admin
// panel, not by re-running this script.
import { eq, and } from "drizzle-orm";
import { db, pageContentTable, pool } from "@workspace/db";

const AMENITIES: Record<"en" | "ar", string[]> = {
  en: [
    "Premium office furniture",
    "Internal intercom phones",
    "Shared coworking spaces",
    "Meeting rooms",
    "Secure, ultra-fast Wi-Fi network",
    "Modern printing equipment",
    "Complimentary beverages",
    "Networking events",
    "Exceptional customer service",
  ],
  ar: [
    "مفروشات مكتبية فاخرة",
    "هواتف اتصال داخلية",
    "مساحات عمل مشتركة",
    "قاعات اجتماعات",
    "شبكة واي فاي آمنة فائقة السرعة",
    "أجهزة طباعة حديثة",
    "مشروبات مجانية",
    "فعاليات التواصل",
    "خدمة عملاء استثنائية",
  ],
};

for (const locale of ["en", "ar"] as const) {
  const [row] = await db
    .select()
    .from(pageContentTable)
    .where(and(eq(pageContentTable.page, "workspace"), eq(pageContentTable.locale, locale)))
    .limit(1);

  if (!row) {
    console.error(`No workspace/${locale} row found — run seed-page-content first.`);
    process.exit(1);
  }

  const content = { ...(row.content as Record<string, unknown>), amenities: AMENITIES[locale] };

  await db
    .update(pageContentTable)
    .set({ content, updatedAt: new Date() })
    .where(eq(pageContentTable.id, row.id));

  console.log(`Updated workspace/${locale} amenities (${AMENITIES[locale].length} items)`);
}

await pool.end();
