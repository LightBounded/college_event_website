import { z } from "zod";

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  adminEmail: z.string().email(),
  membersEmails: z
    .array(z.string().email())
    .length(
      3,
      "Organizations must have 3 additional members, not including the admin",
    ),
});

export const UpdateOrganizationSchema = z.object({
  organizationId: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
});
