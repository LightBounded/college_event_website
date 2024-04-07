import { z } from "zod";

import { UNIVERSITIES } from "~/consts";

export const SignUpSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => {
      const domain = email.split("@")[1]?.split(".")[0];
      return UNIVERSITIES.some((school) => school.acronym === domain);
    }, "Unsupported email domain"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Please enter your password"),
});
