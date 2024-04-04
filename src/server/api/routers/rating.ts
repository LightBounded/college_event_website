import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { ratings } from "~/server/db/schema";
import { CreateRatingSchema, UpdateRatingSchema } from "~/validators/rating";
import {
  createTRPCRouter,
  organizationAdminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const rating = createTRPCRouter({
  allByEventId: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.ratings.findMany({
        where: eq(ratings.eventId, input.eventId),
      });
    }),
  create: protectedProcedure
    .input(CreateRatingSchema)
    .mutation(async ({ input, ctx }) => {
      const rating = await ctx.db.query.ratings.findFirst({
        where: and(
          eq(ratings.eventId, input.eventId),
          eq(ratings.userId, ctx.user.id),
        ),
      });

      if (rating) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User has already rated this event",
        });
      }

      await ctx.db.insert(ratings).values({ ...input, userId: ctx.user.id });
    }),
  update: protectedProcedure
    .input(UpdateRatingSchema)
    .mutation(async ({ input, ctx }) => {
      const rating = await ctx.db.query.ratings.findFirst({
        where: and(
          eq(ratings.eventId, input.eventId),
          eq(ratings.userId, ctx.user.id),
        ),
      });

      if (!rating || rating.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this rating",
        });
      }

      await ctx.db.update(ratings).set(input).where(eq(ratings.id, rating.id));
    }),
  delete: organizationAdminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(ratings)
        .where(
          and(
            eq(ratings.eventId, input.eventId),
            eq(ratings.userId, ctx.user.id),
          ),
        );
    }),
});
