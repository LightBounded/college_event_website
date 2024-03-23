import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInSchema = z.object({
  email: z.string(),
  password: z.string(),
});
