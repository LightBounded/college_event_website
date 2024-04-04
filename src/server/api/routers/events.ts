import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  organizationAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { CreateEventSchema, UpdateEventSchema } from "~/validators/events";

export const eventsRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany();
  }),
  createEvent: organizationAdminProcedure
    .input(CreateEventSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(events).values(input);
    }),
  updateEvent: organizationAdminProcedure
    .input(UpdateEventSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(events)
        .set(input)
        .where(eq(events.id, input.eventId));
    }),
  deleteEvent: organizationAdminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(events).where(eq(events.id, input.eventId));
    }),
});
