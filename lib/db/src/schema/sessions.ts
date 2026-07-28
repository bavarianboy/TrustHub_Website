import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { adminUsersTable } from "./admin-users";

// The session token itself is never stored — only a SHA-256 hash of it — so a
// leaked database dump can't be replayed as a valid cookie.
export const sessionsTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenHash: text("token_hash").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => adminUsersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Session = typeof sessionsTable.$inferSelect;
