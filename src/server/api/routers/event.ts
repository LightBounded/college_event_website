import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  organizationAdminProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { events, universities } from "~/server/db/schema";
import { CreateEventSchema, UpdateEventSchema } from "~/validators/events";

export const event = createTRPCRouter({
  byId: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.events.findFirst({
        where: eq(events.id, input.eventId),
        with: {
          organization: true,
          comments: {
            with: {
              user: true,
            },
          },
        },
      });
    }),
  allByOrganizationId: publicProcedure
    .input(z.object({ organizationId: z.number() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.query.events.findMany({
        where: eq(events.organizationId, input.organizationId),
        with: {
          organization: true,
        },
      });
    }),
  allByUniversityName: publicProcedure
    .input(z.object({ universityName: z.string() }))
    .query(async ({ input, ctx }) => {
      const university = await ctx.db.query.universities.findFirst({
        where: eq(universities.name, input.universityName),
        with: {
          organizations: {
            with: {
              events: {
                with: {
                  organization: true,
                },
              },
            },
          },
        },
      });

      if (!university) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "University not found",
        });
      }

      return university.organizations.flatMap(
        (organization) => organization.events,
      );
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
