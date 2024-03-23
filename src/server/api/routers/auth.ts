import { TRPCError } from "@trpc/server";
import { Scrypt, generateId } from "lucia";
import { cookies } from "next/headers";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { lucia } from "~/server/auth";
import { users } from "~/server/db/schema";
import { SignInSchema, SignUpSchema } from "~/validators/auth";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(SignUpSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: (table, { eq }) => eq(table.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      const hashedPassword = await new Scrypt().hash(input.password);
      const userId = generateId(15);

      await ctx.db.insert(users).values({
        id: userId,
        email: input.email,
        hashedPassword,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),
  signIn: publicProcedure
    .input(SignInSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (table, { eq }) => eq(table.email, input.email),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const isValidPassword = await new Scrypt().verify(
        user.hashedPassword,
        input.password,
      );

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),
});
