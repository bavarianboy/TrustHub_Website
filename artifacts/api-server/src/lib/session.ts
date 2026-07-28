import { randomBytes, createHmac } from "node:crypto";
import type { Response } from "express";
import { env } from "./env";

export const SESSION_COOKIE_NAME = "session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// The raw token is only ever held by the browser cookie and this request; the
// database stores an HMAC of it (keyed by SESSION_SECRET) so a leaked DB dump
// alone can't be replayed as a valid session. Session lookup is by exact
// tokenHash equality via the DB's unique index, so no separate timing-safe
// comparison is needed in application code.
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHmac("sha256", env.sessionSecret).update(token).digest("hex");
}

export function setSessionCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}
