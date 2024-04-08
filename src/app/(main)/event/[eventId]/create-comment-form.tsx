"use client";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { CreateCommentSchema } from "~/validators/comment";

export function CreateCommentForm({
  event,
}: {
  event: NonNullable<RouterOutputs["event"]["byId"]>;
}) {
  const utils = api.useUtils();
  const form = useForm({
    schema: CreateCommentSchema,
    defaultValues: {
      eventId: event.id,
      text: "",
    },
  });

  const createComment = api.comment.create.useMutation({
    onSuccess: async () => {
      await utils.comment.allByEventId.invalidate();
      form.reset();
      toast("Comment created successfully");
    },
    onError: () => {
      toast("Failed to create comment");
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          createComment.mutate(values);
        })}
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={(value) => field.onChange(Number(value))}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating to give this event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Leave a comment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create comment</Button>
      </form>
    </Form>
  );
}
