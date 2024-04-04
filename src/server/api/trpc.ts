/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import superjson from "superjson";
import { z, ZodError } from "zod";

import { type SUPPORTED_SCHOOL_DOMAINS } from "~/consts";
import { db } from "~/server/db";
import { uncachedValidateRequest } from "../auth/validate-request";
import { members, organizations, universities } from "../db/schema";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { session, user } = await uncachedValidateRequest();
  return {
    db,
    session,
    user,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // Infers the `session` and `user` as non-nullable
      session: { ...ctx.session },
      user: { ...ctx.user },
    },
  });
});

// User must be part of the university to use this procedure
export const universityProcedure = protectedProcedure
  .input(
    z.object({
      universityId: z.number(),
    }),
  )
  .use(async ({ ctx, next, input }) => {
    const universityDomain = ctx.user.email.split(
      "@",
    )[1] as (typeof SUPPORTED_SCHOOL_DOMAINS)[number];

    const university = await db.query.universities.findFirst({
      where: eq(universities.id, input.universityId),
    });

    if (!university || university.domain !== universityDomain) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "University not found",
      });
    }

    return next({
      ctx: {
        university,
      },
    });
  });

// User must be an admin of university to use this procedure
export const universityAdminProcedure = universityProcedure.use(
  async ({ ctx, next }) => {
    if (ctx.university.adminId !== ctx.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not an admin for this university",
      });
    }

    return next();
  },
);

// User must be part of the organization to use this procedure
export const organizationProcedure = protectedProcedure
  .input(
    z.object({
      organizationId: z.number(),
    }),
  )
  .use(async ({ ctx, next, input }) => {
    const membership = await db.query.members.findFirst({
      where: and(
        eq(members.userId, ctx.user.id),
        eq(members.organizationId, input.organizationId),
      ),
      with: {
        organization: true,
      },
    });

    if (!membership?.organization) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not a member of this organization",
      });
    }

    return next({
      ctx: {
        organization: membership.organization,
      },
    });
  });

export const organizationAdminProcedure = organizationProcedure.use(
  async ({ ctx, next }) => {
    if (ctx.organization.adminId !== ctx.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not an admin for this organization",
      });
    }

    return next();
  },
);
