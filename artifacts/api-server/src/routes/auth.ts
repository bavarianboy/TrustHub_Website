import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import { db, adminUsersTable, sessionsTable } from "@workspace/db";
import { LoginBody, LoginResponse, GetCurrentUserResponse } from "@workspace/api-zod";
import { validateBody } from "../middlewares/validate";
import { loginRateLimit } from "../middlewares/rate-limit";
import { requireAuth } from "../middlewares/require-auth";
import {
  generateSessionToken,
  hashSessionToken,
  setSessionCookie,
  clearSessionCookie,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
} from "../lib/session";

const router: IRouter = Router();

router.post("/auth/login", loginRateLimit, validateBody(LoginBody), async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email)).limit(1);

  // Run a dummy verify against a fixed hash when no user matches, so the
  // response time doesn't reveal whether the email exists.
  const passwordHash = user?.passwordHash ?? "$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const valid = await argon2.verify(passwordHash, password).catch(() => false);

  if (!user || !valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessionsTable).values({
    tokenHash: hashSessionToken(token),
    userId: user.id,
    expiresAt,
  });
  await db.update(adminUsersTable).set({ lastLoginAt: new Date() }).where(eq(adminUsersTable.id, user.id));

  setSessionCookie(res, token, expiresAt);
  res.json(LoginResponse.parse({ id: user.id, email: user.email, name: user.name }));
});

router.post("/auth/logout", async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (typeof token === "string" && token.length > 0) {
    await db.delete(sessionsTable).where(eq(sessionsTable.tokenHash, hashSessionToken(token)));
  }

  clearSessionCookie(res);
  res.status(204).end();
});

router.get("/auth/me", requireAuth, (req, res) => {
  const user = req.adminUser!;
  res.json(GetCurrentUserResponse.parse({ id: user.id, email: user.email, name: user.name }));
});

export default router;
