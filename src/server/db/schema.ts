// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { SUPPORTED_SCHOOL_DOMAINS } from "~/consts";

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

export const usersRelations = relations(users, ({ many }) => {
  return {
    organizations: many(organizations),
    universities: many(universities),
  };
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
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  adminId: text("admin_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  domain: text("domain", {
    enum: SUPPORTED_SCHOOL_DOMAINS,
  })
    .notNull()
    .unique(),
  description: text("description"),
  studentsCount: int("students_count").notNull().default(0),
  locationId: int("location_id")
    .notNull()
    .references(() => location.id),
});

export const universitiesRelations = relations(universities, ({ one }) => {
  return {
    admin: one(users, {
      fields: [universities.adminId],
      references: [users.id],
    }),
  };
});

export const location = sqliteTable("location", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  longtitude: int("longtitude").notNull(),
  latitude: int("latitude").notNull(),
});

export const organizations = sqliteTable("organization", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  adminId: text("admin_id")
    .notNull()
    .references(() => users.id),
  universityId: int("university_id")
    .notNull()
    .references(() => universities.id),
  description: text("description").notNull(),
  membersCount: int("members_count").notNull().default(0),
});

export const organizationsRelations = relations(organizations, ({ one }) => {
  return {
    admin: one(users, {
      fields: [organizations.adminId],
      references: [users.id],
    }),
    university: one(universities, {
      fields: [organizations.universityId],
      references: [universities.id],
    }),
  };
});

export const members = sqliteTable("member", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  organizationId: int("organization_id")
    .notNull()
    .references(() => organizations.id),
});

export const membersRelations = relations(members, ({ one }) => {
  return {
    user: one(users, {
      fields: [members.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [members.organizationId],
      references: [organizations.id],
    }),
  };
});

export const events = sqliteTable("event", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  organizationId: int("organization_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  description: text("description"),
  locationId: int("location_id")
    .notNull()
    .references(() => location.id),
  time: text("time").notNull(),
  date: text("date").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  membersCount: int("members_count").notNull().default(0),
});

export const comments = sqliteTable("comment", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  eventId: int("event_id")
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
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  eventId: int("event_id")
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
