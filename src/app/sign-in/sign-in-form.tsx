"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { SignInSchema } from "~/validators/auth";

export function SignInForm() {
  const router = useRouter();
  const form = useForm({
    schema: SignInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUp = api.auth.signIn.useMutation({
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
    onSuccess: () => {
      router.push("/");
      toast("Success!", {
        description: "You have successfully signed in",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          signUp.mutate(values);
        })}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="School Email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>Sign In</Button>
      </form>
      <FormDescription className="mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-black underline">
          Sign Up
        </Link>
      </FormDescription>
    </Form>
  );
}
