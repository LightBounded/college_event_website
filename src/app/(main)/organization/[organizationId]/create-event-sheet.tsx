"use client";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { type RouterOutputs } from "~/server/api/root";
import { api } from "~/trpc/react";
import { CreateEventSchema } from "~/validators/events";

export function CreateEventSheet({
  organization,
}: {
  organization: NonNullable<RouterOutputs["organization"]["byId"]>;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">Create Event</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Event</SheetTitle>
          <SheetDescription>
            Fill out the form below to create a new event.
          </SheetDescription>
          <CreateEventForm organization={organization} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function CreateEventForm({
  organization,
}: {
  organization: NonNullable<RouterOutputs["organization"]["byId"]>;
}) {
  const utils = api.useUtils();
  const form = useForm({
    schema: CreateEventSchema,
    defaultValues: {
      name: "",
      description: "",
      date: "",
      time: "",
      location: "",
    },
  });

  const createEvent = api.event.create.useMutation({
    onSuccess: async () => {
      await utils.event.invalidate();
      form.reset();
      toast("Event created successfully");
    },
    onError: () => {
      toast("Failed to create event");
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          createEvent.mutate({
            ...values,
            organizationId: organization.id,
          });
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-2">
          Create Event
        </Button>
      </form>
    </Form>
  );
}
