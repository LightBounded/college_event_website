import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  description: z.string(),
  membersEmails: z
    .array(z.string().email())
    .length(
      3,
      "Organizations must have 3 additional members, not including the admin",
    ),
});

export const UpdateOrganizationSchema = z.object({
  organizationId: z.number(),
  name: z.string().min(1, "Name must be at least 1 character"),
  description: z.string(),
});
