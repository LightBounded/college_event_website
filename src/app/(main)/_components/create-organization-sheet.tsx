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
import { CreateOrganizationSchema } from "~/validators/organization";

export function CreateOrganizationSheet({
  university,
}: {
  university: NonNullable<
    RouterOutputs["user"]["current"]
  >["administeredUniversity"];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create Organization</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Organization</SheetTitle>
          <SheetDescription>
            Fill out the form below to create a new organization.
          </SheetDescription>
          <CreateOrganizationForm university={university} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function CreateOrganizationForm({
  university,
}: {
  university: NonNullable<
    RouterOutputs["user"]["current"]
  >["administeredUniversity"];
}) {
  const utils = api.useUtils();
  const form = useForm({
    schema: CreateOrganizationSchema,
    defaultValues: {
      name: "",
      description: "",
      membersEmails: ["", "", ""],
      adminEmail: "",
    },
  });

  const createOrganization = api.organization.create.useMutation({
    onSuccess: async () => {
      await utils.organization.invalidate();
      form.reset();
      toast("Organization created successfully");
    },
    onError: () => {
      toast("Failed to create organization");
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          createOrganization.mutate({
            ...values,
            universityId: university.id,
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
          name="adminEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Email</FormLabel>
              <FormControl>
                <Input placeholder="Admin Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="membersEmails.0"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member 1</FormLabel>
              <FormControl>
                <Input placeholder="Member 1 Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="membersEmails.1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member 2</FormLabel>
              <FormControl>
                <Input placeholder="Member 2 Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="membersEmails.2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member 3</FormLabel>
              <FormControl>
                <Input placeholder="Member 3 Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-2">
          Create Organization
        </Button>
      </form>
    </Form>
  );
}
