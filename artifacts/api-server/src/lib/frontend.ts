import { fileURLToPath } from "node:url";
import path from "node:path";

// Resolved relative to the running module (dist/index.mjs after the esbuild
// bundle): dist/../../trust-hub/dist/public — the built SPA lives in the
// sibling `trust-hub` package, one level up from `api-server` itself.
const runningDir = path.dirname(fileURLToPath(import.meta.url));
export const frontendDistDir =
  process.env["FRONTEND_DIST_DIR"] ?? path.resolve(runningDir, "..", "..", "trust-hub", "dist", "public");
