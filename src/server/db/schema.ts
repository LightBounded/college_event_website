// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

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
