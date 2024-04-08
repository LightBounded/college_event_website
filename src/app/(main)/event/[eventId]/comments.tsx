"use client";

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { UpdateCommentSchema } from "~/validators/comment";

export function Comments({
  user,
  event,
}: {
  user: RouterOutputs["user"]["current"];
  event: NonNullable<RouterOutputs["event"]["byId"]>;
}) {
  const allComments = api.comment.allByEventId.useQuery(
    {
      eventId: event.id,
    },
    {
      initialData: event.comments,
    },
  );

  return (
    <div className="flex flex-col gap-2">
      {allComments.data.length > 0 ? (
        allComments.data.map((comment) => (
          <Sheet key={comment.id}>
            <SheetTrigger
              disabled={comment.user.id !== user?.id}
              className={cn(
                "rounded-xl",
                comment.user.id === user?.id &&
                  "cursor-pointer transition-transform focus-within:scale-105 hover:scale-105",
              )}
            >
              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <div>
                      {comment.user.email}{" "}
                      {comment.user.id === user?.id && "(You)"}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-normal">
                      <Rating rating={comment.rating} />
                      {new Date(comment.time).toLocaleString().split(",")[0]}
                    </div>
                  </CardTitle>
                  <CardDescription>{comment.text}</CardDescription>
                </CardHeader>
              </Card>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>Edit Comment</SheetTitle>
                <SheetDescription>Edit your comment below.</SheetDescription>
              </SheetHeader>
              <UpdateCommentForm comment={comment} />
            </SheetContent>
          </Sheet>
        ))
      ) : (
        <div>No comments found.</div>
      )}
    </div>
  );
}

function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? <StarFilledIcon /> : <StarIcon />}</span>
      ))}
    </div>
  );
}

function UpdateCommentForm({
  comment,
}: {
  comment: NonNullable<RouterOutputs["comment"]["allByEventId"][number]>;
}) {
  const utils = api.useUtils();
  const form = useForm({
    schema: UpdateCommentSchema,
    defaultValues: {
      text: comment.text,
      rating: comment.rating,
      commentId: comment.id,
    },
  });

  const updateComment = api.comment.update.useMutation({
    onSuccess: async () => {
      await utils.comment.invalidate();
      form.reset();
      toast("Comment updated successfully");
    },
    onError: () => {
      toast("Failed to update comment");
    },
  });

  // eslint-disable-next-line drizzle/enforce-delete-with-where
  const deleteComment = api.comment.delete.useMutation({
    onSuccess: async () => {
      await utils.comment.invalidate();
      form.reset();
      toast("Comment deleted successfully");
    },
    onError: () => {
      toast("Failed to delete comment");
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex grow flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          updateComment.mutate(values);
        })}
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={(value) => field.onChange(Number(value))}>
                <FormLabel>Rating</FormLabel>
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
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Leave a comment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" type="submit">
          Update Comment
        </Button>
        <Button
          className="mt-auto"
          type="button"
          variant="destructive"
          onClick={() => {
            deleteComment.mutate({ commentId: comment.id });
          }}
        >
          Delete
        </Button>
      </form>
    </Form>
  );
}
