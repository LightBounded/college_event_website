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
      <Link href="/" className="flex flex-row text-xl font-semibold">
        LeCollege Events
        <Image src="/lebron.png" alt="LeCollege Logo" width={36} height={32} />
      </Link>
      <Combobox />
      <div>{authButton}</div>
    </nav>
  );
}
