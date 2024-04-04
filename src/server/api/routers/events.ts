import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  organizationAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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
  createEvent: organizationAdminProcedure
    .input(
      // Abstract the input schema into a zod schema in the validators folder
      z.object({
        name: z.string(),
        description: z.string(),
        locationId: z.string(),
        time: z.string(),
        date: z.string(),
        contactEmail: z.string(),
        contactPhone: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(events).values(input);
    }),
});
