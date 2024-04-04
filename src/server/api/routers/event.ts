import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  organizationAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { CreateEventSchema, UpdateEventSchema } from "~/validators/events";

export const event = createTRPCRouter({
  allByOrganizationId: publicProcedure
    .input(z.object({ organizationId: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.query.events.findMany({
        where: eq(events.organizationId, input.organizationId),
      });
    }),
  create: organizationAdminProcedure
    .input(CreateEventSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(events).values(input);
    }),
  update: organizationAdminProcedure
    .input(UpdateEventSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(events)
        .set(input)
        .where(eq(events.id, input.eventId));
    }),
  delete: organizationAdminProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(events).where(eq(events.id, input.eventId));
    }),
});
