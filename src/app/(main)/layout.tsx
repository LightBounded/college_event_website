import Link from "next/link";

import { Button } from "~/components/ui/button";
import { validateRequest } from "~/server/auth/validate-request";
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
      <Link href="/" className="text-xl font-semibold">
        Varsity Vibes
      </Link>
      <ul className="flex gap-4">
        <li>
          <Link href="/sign-in">Events</Link>
        </li>
        <li>
          <Link href="/sign-in">Organization</Link>
        </li>
      </ul>
      <div>{authButton}</div>
    </nav>
  );
}
