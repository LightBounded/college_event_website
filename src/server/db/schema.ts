// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { on } from "events";
import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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

export const users = sqliteTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    email: text("email").notNull().unique(),
    hashedPassword: text("hashed_password").notNull(),
  },
  (users) => ({
    emailIndex: index("email_idx").on(users.email),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => {
  return {
    organizations: many(organizations),
    administeredUniversity: one(universities, {
      fields: [users.id],
      references: [universities.adminId],
      relationName: "administered_university",
    }),
  };
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  expiresAt: int("expires_at").notNull(),
});

export const universities = sqliteTable("university", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  adminId: text("admin_id")
    .notNull()
    .unique()
    .references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
});

export const universitiesRelations = relations(
  universities,
  ({ one, many }) => {
    return {
      admin: one(users, {
        fields: [universities.adminId],
        references: [users.id],
      }),
      organizations: many(organizations),
    };
  },
);

export const organizations = sqliteTable("organization", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull(),
  adminId: text("admin_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  universityId: int("university_id")
    .notNull()
    .references(() => universities.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  description: text("description").notNull(),
});

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => {
    return {
      admin: one(users, {
        fields: [organizations.adminId],
        references: [users.id],
      }),
      university: one(universities, {
        fields: [organizations.universityId],
        references: [universities.id],
      }),
      events: many(events),
    };
  },
);

export const members = sqliteTable(
  "member",
  {
    id: int("id").notNull().primaryKey({
      autoIncrement: true,
    }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    organizationId: int("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    unique: unique().on(table.userId, table.organizationId),
  }),
);

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
    .references(() => organizations.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  time: text("time").notNull(),
  date: text("date").notNull(),
});

export const eventsRelations = relations(events, ({ one, many }) => {
  return {
    organization: one(organizations, {
      fields: [events.organizationId],
      references: [organizations.id],
    }),
    comments: many(comments),
  };
});

export const comments = sqliteTable("comment", {
  id: int("id").notNull().primaryKey({
    autoIncrement: true,
  }),
  eventId: int("event_id")
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  text: text("text").notNull(),
  rating: int("rating").notNull(),
  time: text("time")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const commentsRelations = relations(comments, ({ one }) => {
  return {
    user: one(users, {
      fields: [comments.userId],
      references: [users.id],
    }),
    event: one(events, {  
      fields: [comments.eventId],
      references: [events.id],
    }),
  };
});
