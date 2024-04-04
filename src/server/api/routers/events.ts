import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";

export const eventsRouter = createTRPCRouter({
  getEvent: publicProcedure.query(async ({ ctx }) => {
    const eventsList = await ctx.db.query.events.findMany();

    if (!eventsList) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Events not found",
      });
    }

    return eventsList;
  }),
});
