import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, pageContentTable } from "@workspace/db";
import {
  GetAboutContentQueryParams,
  GetAboutContentResponse,
  GetServicesContentQueryParams,
  GetServicesContentResponse,
  GetWorkspaceContentQueryParams,
  GetWorkspaceContentResponse,
  GetContactContentQueryParams,
  GetContactContentResponse,
  GetLegalContentQueryParams,
  GetLegalContentResponse,
  GetProgramPageContentParams,
  GetProgramPageContentQueryParams,
  GetProgramPageContentResponse,
} from "@workspace/api-zod";
import { HttpError } from "../middlewares/error-handler";
import { requireParam } from "../lib/params";

const router: IRouter = Router();

type Page = "about" | "services" | "workspace" | "privacy" | "terms" | "contact" | "programs" | "incubator-program" | "accelerator-program";
type Locale = "en" | "ar";

async function loadContent(page: Page, locale: Locale): Promise<unknown> {
  const [row] = await db
    .select({ content: pageContentTable.content })
    .from(pageContentTable)
    .where(and(eq(pageContentTable.page, page), eq(pageContentTable.locale, locale)))
    .limit(1);

  if (!row) {
    throw new HttpError(404, `No ${page} content for locale "${locale}" yet`);
  }

  return row.content;
}

router.get("/page-content/about", async (req, res) => {
  const parsed = GetAboutContentQueryParams.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "locale query parameter must be 'en' or 'ar'");
  res.json(GetAboutContentResponse.parse(await loadContent("about", parsed.data.locale)));
});

router.get("/page-content/programs/:page", async (req, res) => {
  const parsed = GetProgramPageContentParams.safeParse({ page: requireParam(req, "page") });
  const query = GetProgramPageContentQueryParams.safeParse(req.query);
  if (!parsed.success || !query.success) throw new HttpError(400, "Invalid program page or locale");
  res.json(GetProgramPageContentResponse.parse(await loadContent(parsed.data.page, query.data.locale)));
});

router.get("/page-content/services", async (req, res) => {
  const parsed = GetServicesContentQueryParams.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "locale query parameter must be 'en' or 'ar'");
  res.json(GetServicesContentResponse.parse(await loadContent("services", parsed.data.locale)));
});

router.get("/page-content/workspace", async (req, res) => {
  const parsed = GetWorkspaceContentQueryParams.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "locale query parameter must be 'en' or 'ar'");
  res.json(GetWorkspaceContentResponse.parse(await loadContent("workspace", parsed.data.locale)));
});

router.get("/page-content/contact", async (req, res) => {
  const parsed = GetContactContentQueryParams.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "locale query parameter must be 'en' or 'ar'");
  res.json(GetContactContentResponse.parse(await loadContent("contact", parsed.data.locale)));
});

router.get("/page-content/legal/:page", async (req, res) => {
  const page = requireParam(req, "page");
  if (page !== "privacy" && page !== "terms") {
    throw new HttpError(404, "Unknown legal page");
  }

  const parsed = GetLegalContentQueryParams.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "locale query parameter must be 'en' or 'ar'");
  res.json(GetLegalContentResponse.parse(await loadContent(page, parsed.data.locale)));
});

export default router;
