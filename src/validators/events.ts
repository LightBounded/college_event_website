import { z } from "zod";

export const CreateEventSchema = z.object({
  name: z.string(),
  description: z.string(),
  locationId: z.number(),
  time: z.string(),
  date: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
});

export const UpdateEventSchema = z.object({
  eventId: z.number(),
  name: z.string(),
  description: z.string(),
  locationId: z.number(),
  time: z.string(),
  date: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
});
