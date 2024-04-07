import { z } from "zod";

import { UNIVERSITIES } from "~/consts";

export const SignUpSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => {
      // Check if email ends in .edu
      const supportedDomains = UNIVERSITIES.map((u) => `${u.acronym}.edu`);
      return supportedDomains.includes(email.split("@")[1]!);
    }, "Unsupported email domain"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Please enter your password"),
});
