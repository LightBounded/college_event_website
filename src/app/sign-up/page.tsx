import { redirect } from "next/navigation";

import { validateRequest } from "~/server/auth/validate-request";
import { SignUpForm } from "./sign-up-form";

export default async function SignUp() {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center">
      <SignUpForm />
    </div>
  );
}
