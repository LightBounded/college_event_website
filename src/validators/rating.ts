import { z } from "zod";

export const CreateRatingSchema = z.object({
  eventId: z.number(),
  value: z.number().int().min(1).max(5),
});

export const UpdateRatingSchema = z.object({
  eventId: z.number(),
  value: z.number().int().min(1).max(5),
});
