import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "closed"]);
export const localeEnum = pgEnum("locale", ["en", "ar"]);

export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  service: text("service"),
  message: text("message").notNull(),
  sourcePage: text("source_page"),
  locale: localeEnum("locale").notNull().default("en"),
  status: leadStatusEnum("status").notNull().default("new"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Public-facing insert: only fields the contact form actually submits.
// ipAddress/userAgent/status/sourcePage are set server-side, not by the client.
export const insertLeadSchema = createInsertSchema(leadsTable).pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  service: true,
  message: true,
  locale: true,
});
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
