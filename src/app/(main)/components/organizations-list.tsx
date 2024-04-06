"use client";

import { use, useState } from "react";
import Link from "next/link";

import type { SCHOOLS } from "~/consts";
import type { RouterOutputs } from "~/server/api/root";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function OrganizationsList({
  universityName,
  promise,
}: {
  universityName: (typeof SCHOOLS)[number]["name"];
  promise: Promise<RouterOutputs["organization"]["allByUniversityName"]>;
}) {
  const orgsFromServer = use(promise);
  const allOrgs = api.organization.allByUniversityName.useQuery(
    {
      universityName,
    },
    {
      initialData: orgsFromServer,
    },
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = allOrgs.data.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search organizations"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex h-9 w-1/2 rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />

      {filteredEvents.length > 0 ? (
        filteredEvents.map((org) => (
          <Card
            key={org.name}
            className="w-[300px] transition-transform hover:scale-x-105 hover:cursor-pointer lg:w-[600px]"
          >
            <Link href={"/" + org.id}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>{org.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))
      ) : (
        <div className="w-[300px] lg:w-[600px]">No organizations found.</div>
      )}
    </>
  );
}
