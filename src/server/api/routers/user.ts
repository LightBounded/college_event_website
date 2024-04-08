import { eq } from "drizzle-orm";

import { users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const user = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      with: {
        administeredUniversity: true,
        members: {
          with: {
            organization: true,
          },
        },
      },
    });

    return user;
  }),
});
