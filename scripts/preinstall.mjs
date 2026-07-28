// Cross-platform replacement for the original `sh -c` preinstall guard.
// Enforces pnpm as the only package manager and clears stray lockfiles.
import { rmSync } from "node:fs";

for (const lockfile of ["package-lock.json", "yarn.lock"]) {
  rmSync(lockfile, { force: true });
}

const userAgent = process.env["npm_config_user_agent"] ?? "";

if (!userAgent.startsWith("pnpm/")) {
  console.error("Use pnpm instead (see README.md for setup).");
  process.exit(1);
}
