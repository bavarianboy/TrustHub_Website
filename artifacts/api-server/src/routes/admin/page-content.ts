import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, pageContentTable } from "@workspace/db";
import {
  AdminGetAboutContentResponse,
  AdminUpdateAboutContentBody,
  AdminUpdateAboutContentResponse,
  AdminGetServicesContentResponse,
  AdminUpdateServicesContentBody,
  AdminUpdateServicesContentResponse,
  AdminGetWorkspaceContentResponse,
  AdminUpdateWorkspaceContentBody,
  AdminUpdateWorkspaceContentResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../../middlewares/require-auth";
import { validateBody } from "../../middlewares/validate";
import { HttpError } from "../../middlewares/error-handler";

const router: IRouter = Router();

router.use(requireAuth);

type Page = "about" | "services" | "workspace";

async function loadBothLocales(page: Page): Promise<{ en: unknown; ar: unknown }> {
  const rows = await db.select().from(pageContentTable).where(eq(pageContentTable.page, page));
  const en = rows.find((r) => r.locale === "en")?.content;
  const ar = rows.find((r) => r.locale === "ar")?.content;

  if (en === undefined || ar === undefined) {
    throw new HttpError(404, `${page} content is missing a locale — seed it before editing`);
  }

  return { en, ar };
}

async function saveBothLocales(page: Page, body: { en: unknown; ar: unknown }): Promise<{ en: unknown; ar: unknown }> {
  await db.transaction(async (tx) => {
    for (const locale of ["en", "ar"] as const) {
      await tx
        .insert(pageContentTable)
        .values({ page, locale, content: body[locale] })
        .onConflictDoUpdate({
          target: [pageContentTable.page, pageContentTable.locale],
          set: { content: body[locale], updatedAt: new Date() },
        });
    }
  });

  return body;
}

router.get("/page-content/about", async (_req, res) => {
  res.json(AdminGetAboutContentResponse.parse(await loadBothLocales("about")));
});

router.put("/page-content/about", validateBody(AdminUpdateAboutContentBody), async (req, res) => {
  const body = req.body as { en: unknown; ar: unknown };
  res.json(AdminUpdateAboutContentResponse.parse(await saveBothLocales("about", body)));
});

router.get("/page-content/services", async (_req, res) => {
  res.json(AdminGetServicesContentResponse.parse(await loadBothLocales("services")));
});

router.put("/page-content/services", validateBody(AdminUpdateServicesContentBody), async (req, res) => {
  const body = req.body as { en: unknown; ar: unknown };
  res.json(AdminUpdateServicesContentResponse.parse(await saveBothLocales("services", body)));
});

router.get("/page-content/workspace", async (_req, res) => {
  res.json(AdminGetWorkspaceContentResponse.parse(await loadBothLocales("workspace")));
});

router.put("/page-content/workspace", validateBody(AdminUpdateWorkspaceContentBody), async (req, res) => {
  const body = req.body as { en: unknown; ar: unknown };
  res.json(AdminUpdateWorkspaceContentResponse.parse(await saveBothLocales("workspace", body)));
});

export default router;
