"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function SignOutButton() {
  const router = useRouter();

  const signOut = api.auth.signOut.useMutation({
    onSuccess: () => {
      router.push("/sign-in");
      toast("Success!", {
        description: "You have successfully signed out",
      });
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  return (
    <Button
      onClick={() => {
        signOut.mutate();
      }}
    >
      Sign Out
    </Button>
  );
}
