import Link from "next/link";

import { Button } from "~/components/ui/button";
import { signOutAction } from "~/lib/actions";
import { validateRequest } from "~/server/auth/validate-request";
import { Schools } from "./components/schools";

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

  return (
    <nav className="flex h-16 items-center justify-between gap-4 px-4">
      <div className="flex flex-row gap-4 text-xl font-semibold">
        <Link
          href="/"
          className="flex flex-row bg-gradient-to-r from-violet-600 to-indigo-400 bg-clip-text text-xl font-semibold text-transparent transition-all hover:scale-105 hover:text-foreground"
        >
          LeCollege<span className="text-secondary-foreground">Events</span>
        </Link>
        <Schools />
      </div>
      {user ? (
        <form action={signOutAction}>
          <Button
            size="sm"
            className="transition-all hover:scale-105 hover:bg-foreground hover:text-secondary"
            type="submit"
          >
            Sign Out
          </Button>
        </form>
      ) : (
        <Link href="/sign-in">
          <Button
            size="sm"
            className="transition-all hover:scale-105 hover:bg-foreground hover:text-secondary"
          >
            Sign In
          </Button>
        </Link>
      )}
    </nav>
  );
}
