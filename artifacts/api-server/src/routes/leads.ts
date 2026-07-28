import { Router, type IRouter } from "express";
import type { z } from "zod";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody, CreateLeadResponse } from "@workspace/api-zod";
import { validateBody } from "../middlewares/validate";
import { leadsRateLimit } from "../middlewares/rate-limit";

const router: IRouter = Router();

router.post("/leads", leadsRateLimit, validateBody(CreateLeadBody), async (req, res) => {
  const { website, ...body } = req.body as z.infer<typeof CreateLeadBody>;

  // Honeypot: a hidden field real users never fill in. Bots that autofill
  // every input trip it. Report success without writing anything, so the
  // bot gets no signal that it was caught.
  if (website) {
    res.status(201).json(
      CreateLeadResponse.parse({
        id: "00000000-0000-0000-0000-000000000000",
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        company: body.company ?? null,
        service: body.service ?? null,
        message: body.message,
        sourcePage: null,
        locale: body.locale ?? "en",
        status: "new",
        createdAt: new Date(),
      }),
    );
    return;
  }

  const [lead] = await db
    .insert(leadsTable)
    .values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      service: body.service,
      message: body.message,
      locale: body.locale ?? "en",
      sourcePage: req.get("referer") ?? null,
      ipAddress: req.ip ?? null,
      userAgent: req.get("user-agent") ?? null,
    })
    .returning();

  res.status(201).json(CreateLeadResponse.parse(lead));
});

export default router;
