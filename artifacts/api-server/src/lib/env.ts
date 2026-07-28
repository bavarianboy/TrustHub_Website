// PORT is optional (defaults to 5000, see index.ts) because Replit no longer
// injects it. SESSION_SECRET has no safe default — a missing or weak secret
// would let anyone forge a session cookie, so it's required outright.
const sessionSecret = process.env["SESSION_SECRET"];

if (!sessionSecret || sessionSecret.length < 16) {
  throw new Error(
    "SESSION_SECRET must be set to a random string of at least 16 characters. " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
  );
}

export const env = {
  sessionSecret,
  corsOrigin: process.env["CORS_ORIGIN"],
  isProduction: process.env["NODE_ENV"] === "production",
};
