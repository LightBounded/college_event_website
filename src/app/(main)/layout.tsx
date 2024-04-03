import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { validateRequest } from "~/server/auth/validate-request";
import { Combobox } from "./combobox";
import { SignOutButton } from "./sign-out-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

async function Navigation() {
  const { user } = await validateRequest();

  const authButton = user ? (
    <SignOutButton />
  ) : (
    <Button asChild>
      <Link href="/sign-in">Sign In</Link>
    </Button>
  );

  return (
    <nav className="flex h-16 items-center justify-between gap-4 px-4">
      <div className="flex flex-row gap-4 text-xl font-semibold">
        <Link
          href="/"
          className="flex flex-row bg-gradient-to-r from-violet-600 to-indigo-400 bg-clip-text text-xl font-semibold text-transparent"
        >
          LeCollege<span className="text-black">Events</span>
        </Link>
        <Combobox />
      </div>
      <div>{authButton}</div>
    </nav>
  );
}
