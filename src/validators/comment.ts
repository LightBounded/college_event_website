import { z } from "zod";

export const CreateCommentSchema = z.object({
  eventId: z.number(),
  text: z.string().min(1, "Comment must be at least 1 character"),
});

export const UpdateCommentSchema = z.object({
  commentId: z.number(),
  text: z.string().min(1, "Comment must be at least 1 character"),
});
