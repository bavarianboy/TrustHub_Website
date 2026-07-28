import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  // A relative path, not an absolute one built with path.join(__dirname, ...).
  // drizzle-kit resolves this with a glob matcher that treats parentheses as
  // extglob syntax; this repo's absolute path contains a literal "(Trust
  // HUB)" segment, which silently breaks the match. A path relative to this
  // config file's own directory (drizzle-kit's cwd for `push`) has no parens
  // in it and resolves correctly on Windows.
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
