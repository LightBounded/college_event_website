import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { members, organizations, users } from "~/server/db/schema";
import {
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
} from "~/validators/organization";
import {
  createTRPCRouter,
  publicProcedure,
  universityAdminProcedure,
  universityProcedure,
} from "../trpc";

export const organization = createTRPCRouter({
  allByUniversityId: publicProcedure
    .input(
      z.object({
        universityId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.organizations.findMany({
        where: eq(organizations.universityId, input.universityId),
      });
    }),
  create: universityProcedure
    .input(CreateOrganizationSchema)
    .mutation(async ({ input: { membersEmails, ...newOrganization }, ctx }) => {
      await ctx.db.transaction(async (db) => {
        // Create organization
        const [insertedOrganization] = await db
          .insert(organizations)
          .values({
            ...newOrganization,
            adminId: ctx.user.id,
            membersCount: 4,
          })
          .returning();

        if (!insertedOrganization) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create organization",
          });
        }

        // Get members with the provided emails
        const newMembers = await db.query.users.findMany({
          where: inArray(users.email, membersEmails),
        });

        // Insert members
        await db.insert(members).values(
          newMembers.map((member) => ({
            userId: member.id,
            organizationId: insertedOrganization.id,
          })),
        );
      });
    }),
  update: universityAdminProcedure
    .input(UpdateOrganizationSchema)
    .mutation(
      async ({ input: { organizationId, ...newOrganization }, ctx }) => {
        await ctx.db
          .update(organizations)
          .set(newOrganization)
          .where(eq(organizations.id, organizationId));
      },
    ),
  delete: universityAdminProcedure
    .input(
      z.object({
        organizationId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(organizations)
        .where(eq(organizations.id, input.organizationId));
    }),
  byId: publicProcedure
    .input(
      z.object({
        organizationId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.query.organizations.findFirst({
        where: eq(organizations.id, input.organizationId),
      });
    }),
});
