import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, TimeSpan } from "lucia";
import { type User, sessions, users } from "../db/schema";
import { db } from "../db";
import { env } from "~/env";

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => ({
    id: attributes.id,
    email: attributes.email,
  }),
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "hashedPassword">;
  }
}

