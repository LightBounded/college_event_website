import { z } from "zod";

import { SUPPORTED_SCHOOL_DOMAINS } from "~/consts";

export const SignUpSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => {
      const domain = email.split(
        "@",
      )[1] as (typeof SUPPORTED_SCHOOL_DOMAINS)[number];
      return SUPPORTED_SCHOOL_DOMAINS.includes(domain);
    }, "Unsupported email domain"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Please enter your password"),
});
