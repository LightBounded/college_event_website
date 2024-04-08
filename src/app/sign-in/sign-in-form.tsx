"use client";

import Link from "next/link";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useFormState } from "react-dom";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { signInAction } from "~/lib/actions";

export function SignInForm() {
  const [state, formAction] = useFormState(signInAction, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex h-5 flex-row content-center justify-center gap-1">
          <span className="flex flex-row bg-gradient-to-r from-violet-600 to-indigo-400 bg-clip-text font-semibold text-transparent">
            LeCollegeEvents
          </span>{" "}
          Sign In
        </CardTitle>
        <CardDescription>
          Sign in using your school email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-2">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input name="email" placeholder="Email" autoComplete="email" />
            {state?.fieldError?.email && (
              <p className="text-sm text-red-500">{state.fieldError.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
            />
            {state?.fieldError?.password && (
              <p className="text-sm text-red-500">
                {state.fieldError.password}
              </p>
            )}
          </div>
          <Button className="mt-2" type="submit">
            Sign In
          </Button>
          <p className="font-regular mt-2 text-center text-sm">
            Don&apos;t have an account?
            <Link href="/sign-up" className="font-semibold">
              {" "}
              Sign Up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
