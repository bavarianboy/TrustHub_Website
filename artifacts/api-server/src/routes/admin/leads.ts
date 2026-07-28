import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import { AdminListLeadsQueryParams, AdminListLeadsResponse, AdminUpdateLeadStatusBody, AdminUpdateLeadStatusResponse } from "@workspace/api-zod";
import { requireAuth } from "../../middlewares/require-auth";
import { validateBody } from "../../middlewares/validate";
import { HttpError } from "../../middlewares/error-handler";
import { requireParam } from "../../lib/params";

const router: IRouter = Router();

router.use(requireAuth);

router.get("/leads", async (req, res) => {
  const parsedQuery = AdminListLeadsQueryParams.safeParse(req.query);

  if (!parsedQuery.success) {
    throw new HttpError(400, "Invalid status filter");
  }

  const { status } = parsedQuery.data;

  const rows = await db
    .select()
    .from(leadsTable)
    .where(status ? eq(leadsTable.status, status) : undefined)
    .orderBy(desc(leadsTable.createdAt));

  res.json(AdminListLeadsResponse.parse(rows));
});

router.patch("/leads/:id", validateBody(AdminUpdateLeadStatusBody), async (req, res) => {
  const { status } = req.body as { status: "new" | "contacted" | "closed" };

  const [lead] = await db
    .update(leadsTable)
    .set({ status })
    .where(eq(leadsTable.id, requireParam(req, "id")))
    .returning();

  if (!lead) {
    throw new HttpError(404, "Lead not found");
  }

  res.json(AdminUpdateLeadStatusResponse.parse(lead));
});

export default router;
