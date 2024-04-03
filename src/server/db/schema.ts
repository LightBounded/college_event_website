// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// export const posts = sqliteTable(
//   "post",
//   {
//     id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
//     name: text("name", { length: 256 }),
//     createdAt: int("created_at", { mode: "timestamp" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: int("updatedAt", { mode: "timestamp" }),
//   },
//   (example) => ({
//     nameIndex: index("name_idx").on(example.name),
//   }),
// );

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: int("expires_at").notNull(),
});

export const universities = sqliteTable("university", {
  id: text("id").notNull().primaryKey(),
  adminId: text("admin_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  studentsCount: int("students_count").notNull().default(0),
  locationId: text("location_id")
    .notNull()
    .references(() => location.id),
});

export const location = sqliteTable("location", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  longtitude: int("longtitude").notNull(),
  latitude: int("latitude").notNull(),
});

export const organizations = sqliteTable("organization", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  description: text("description"),
  membersCount: int("members_count").notNull().default(0),
});

export const members = sqliteTable("member", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
});

export const events = sqliteTable("event", {
  id: text("id").notNull().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  locationId: text("location_id")
    .notNull()
    .references(() => location.id),
  time: text("time").notNull(),
  date: text("date").notNull(),
  membersCount: int("members_count").notNull().default(0),
});

export const comments = sqliteTable("comment", {
  id: text("id").notNull().primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  text: text("text").notNull(),
  time: text("time")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const ratings = sqliteTable("rating", {
  id: text("id").notNull().primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  value: int("value").notNull(),
  time: text("time")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
