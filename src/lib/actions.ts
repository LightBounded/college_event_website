"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateId, Scrypt } from "lucia";

import { lucia } from "~/server/auth";
import { validateRequest } from "~/server/auth/validate-request";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { SignInSchema, SignUpSchema } from "~/validators/auth";

export async function signOutAction() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function signUpAction(_: unknown, formData: FormData) {
  const object = Object.fromEntries(formData);
  const parsed = SignUpSchema.safeParse(object);
  if (!parsed.success) {
    const error = parsed.error.flatten();
    return {
      fieldError: {
        email: error.fieldErrors.email?.[0],
        password: error.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (existingUser) {
    return {
      fieldError: {
        email: "Email is already in use",
      },
    };
  }
  const hashedPassword = await new Scrypt().hash(password);
  const userId = generateId(15);

  await db.insert(users).values({
    id: userId,
    email: email,
    hashedPassword: hashedPassword,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/");
}

export async function signInAction(_: unknown, formData: FormData) {
  const object = Object.fromEntries(formData.entries());
  const parsed = SignInSchema.safeParse(object);

  if (!parsed.success) {
    const error = parsed.error.flatten();
    return {
      fieldError: {
        email: error.fieldErrors.email?.[0],
        password: error.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!user) {
    return {
      fieldError: {
        password: "Invalid email or password",
      },
    };
  }

  const validPassword = await new Scrypt().verify(
    user.hashedPassword,
    password,
  );

  if (!validPassword) {
    return {
      fieldError: {
        password: "Invalid email or password",
      },
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/explore");
}
