"use client";

import { useState } from "react";
import { toast } from "sonner";
import { set } from "zod";

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
  const [open, setOpen] = useState(false);

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
      setOpen(false);
    },
    onError: () => {
      toast("Failed to create comment");
    },
  });

  return (
    <>
      {!open ? (
        <Button className="mb-4" onClick={() => setOpen(true)}>
          Leave a comment
        </Button>
      ) : (
        <Form {...form}>
          <form
            className="mb-4 flex flex-col gap-2"
            onSubmit={form.handleSubmit(async (values) => {
              createComment.mutate(values);
            })}
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
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
            <div className="flex gap-2">
              <Button type="submit">Create comment</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
