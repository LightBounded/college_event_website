import { z } from "zod";

export const CreateEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  time: z.string().min(1, "Time is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
});

export const UpdateEventSchema = z.object({
  eventId: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  time: z.string().min(1, "Time is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
});
