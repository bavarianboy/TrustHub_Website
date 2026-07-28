import type { Request, Response, NextFunction, RequestHandler } from "express";
import { eq, and, gt } from "drizzle-orm";
import { db, sessionsTable, adminUsersTable, type AdminUser } from "@workspace/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../lib/session";

declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminUser;
    }
  }
}

export const requireAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (typeof token !== "string" || token.length === 0) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const tokenHash = hashSessionToken(token);
  const [row] = await db
    .select({ user: adminUsersTable })
    .from(sessionsTable)
    .innerJoin(adminUsersTable, eq(sessionsTable.userId, adminUsersTable.id))
    .where(and(eq(sessionsTable.tokenHash, tokenHash), gt(sessionsTable.expiresAt, new Date())))
    .limit(1);

  if (!row) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  req.adminUser = row.user;
  next();
};
