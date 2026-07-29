import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

// Resolved relative to the running module (dist/index.mjs after the esbuild
// bundle), one level up — dist/../uploads — so the directory sits next to
// dist rather than inside it and survives `dist` being wiped on every build.
const runningDir = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = process.env["UPLOADS_DIR"] ?? path.resolve(runningDir, "..", "uploads");

fs.mkdirSync(uploadsDir, { recursive: true });
