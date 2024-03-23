import { z } from "zod";

import { SUPPORTED_SCHOOL_DOMAINS } from "~/consts";

export const SignUpSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => {
      const domain = email.split("@")[1]!; // Email must have a domain
      return SUPPORTED_SCHOOL_DOMAINS.includes(domain);
    }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInSchema = z.object({
  email: z.string(),
  password: z.string(),
});
