import { redirect } from "next/navigation";

import { validateRequest } from "~/server/auth/validate-request";
import { SignInForm } from "./sign-in-form";

export default async function SignIn() {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <div className="mx-auto flex min-h-screen max-w-80 flex-col items-center justify-center">
      <SignInForm />
    </div>
  );
}
