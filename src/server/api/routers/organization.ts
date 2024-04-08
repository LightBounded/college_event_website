import { TRPCError } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { getUniversityFromEmail } from "~/lib/utils";
import {
  members,
  organizations,
  universities,
  users,
} from "~/server/db/schema";
import {
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
} from "~/validators/organization";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  universityAdminProcedure,
} from "../trpc";

export const organization = createTRPCRouter({
  allByUniversityName: publicProcedure
    .input(
      z.object({
        universityName: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const university = await ctx.db.query.universities.findFirst({
        where: eq(universities.name, input.universityName),
      });

      if (!university) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "University not found",
        });
      }

      return ctx.db.query.organizations.findMany({
        where: eq(organizations.universityId, university.id),
      });
    }),
  create: universityAdminProcedure
    .input(CreateOrganizationSchema)
    .mutation(
      async ({
        input: { membersEmails, adminEmail, ...newOrganization },
        ctx,
      }) => {
        await ctx.db.transaction(async (db) => {
          const allMembersEmails = [...membersEmails, adminEmail];

          // Check if all members are part of this university
          const areValidMembers = allMembersEmails.every((e) => {
            const university = getUniversityFromEmail(e);
            if (university.name !== ctx.university.name) {
              return false;
            }
            return true;
          });

          if (!areValidMembers) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid members provided",
            });
          }

          // Get admin with the provided email
          const admin = await db.query.users.findFirst({
            where: eq(users.email, adminEmail),
          });

          if (!admin) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid admin provided",
            });
          }

          // Create organization
          const [insertedOrganization] = await db
            .insert(organizations)
            .values({
              ...newOrganization,
              adminId: admin.id,
              universityId: ctx.university.id,
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
            where: inArray(users.email, allMembersEmails),
          });

          if (newMembers.length !== 4) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid members provided",
            });
          }

          // Insert members
          await db.insert(members).values(
            newMembers.map((member) => ({
              userId: member.id,
              organizationId: insertedOrganization.id,
            })),
          );
        });
      },
    ),
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
        with: {
          events: {
            with: {
              organization: true,
            },
          },
        },
      });
    }),
  join: protectedProcedure
    .input(
      z.object({
        organizationId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const organization = await ctx.db.query.organizations.findFirst({
        where: eq(organizations.id, input.organizationId),
        with: {
          university: true,
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      if (ctx.user.university.name !== organization.university.name) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization not part of your university",
        });
      }

      await ctx.db.insert(members).values({
        userId: ctx.user.id,
        organizationId: input.organizationId,
      });
    }),
  leave: protectedProcedure
    .input(
      z.object({
        organizationId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(members)
        .where(
          and(
            eq(members.userId, ctx.user.id),
            eq(members.organizationId, input.organizationId),
          ),
        );
    }),
});
