// Creates (or updates the password of) an admin user.
// Usage: pnpm --filter @workspace/scripts run seed-admin -- <email> <password> [name]
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { db, adminUsersTable, pool } from "@workspace/db";

const [email, password, name = "Admin"] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: pnpm --filter @workspace/scripts run seed-admin -- <email> <password> [name]");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const passwordHash = await argon2.hash(password);

const [existing] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email)).limit(1);

if (existing) {
  await db.update(adminUsersTable).set({ passwordHash, name }).where(eq(adminUsersTable.id, existing.id));
  console.log(`Updated password for existing admin user: ${email}`);
} else {
  await db.insert(adminUsersTable).values({ email, passwordHash, name });
  console.log(`Created admin user: ${email}`);
}

await pool.end();
