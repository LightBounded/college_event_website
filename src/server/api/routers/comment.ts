import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { comments } from "~/server/db/schema";
import { CreateCommentSchema, UpdateCommentSchema } from "~/validators/comment";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const comment = createTRPCRouter({
  allByEventId: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.comments.findMany({
        where: eq(comments.eventId, input.eventId),
        with: {
          user: true,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(comments).where(eq(comments.id, input.commentId));
    }),
  create: protectedProcedure
    .input(CreateCommentSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(comments).values({
        ...input,
        userId: ctx.user.id,
      });
    }),

  update: protectedProcedure
    .input(UpdateCommentSchema)
    .mutation(async ({ input, ctx }) => {
      // Check if the user is the author of the comment
      const comment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, input.commentId),
      });

      if (!comment || comment.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this comment",
        });
      }

      await ctx.db
        .update(comments)
        .set({
          text: input.text,
          rating: input.rating,
        })
        .where(eq(comments.id, input.commentId));
    }),
});
