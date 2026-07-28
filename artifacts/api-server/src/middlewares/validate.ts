import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodType } from "zod";

// Parses req.body against `schema` and replaces it with the parsed (typed,
// stripped-of-extra-fields) result. Routes downstream can trust req.body's
// shape without re-checking it.
export function validateBody(schema: ZodType): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error.issues.map((i) => i.message).join("; ") });
      return;
    }

    req.body = result.data;
    next();
  };
}
