"use client";

import { use, useState } from "react";
import Link from "next/link";

import type { UNIVERSITIES } from "~/consts";
import type { RouterOutputs } from "~/server/api/root";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export function OrganizationsList({
  universityName,
  promise,
}: {
  universityName: (typeof UNIVERSITIES)[number]["name"];
  promise: Promise<RouterOutputs["organization"]["allByUniversityName"]>;
}) {
  const organizationsFromServer = use(promise);
  const allOrganizations = api.organization.allByUniversityName.useQuery(
    {
      universityName,
    },
    {
      initialData: organizationsFromServer,
    },
  );
  const [search, setSearch] = useState("");

  const filteredOrganizations = allOrganizations.data.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Input
        className="mb-2 w-full"
        placeholder="Search for an organization"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        {filteredOrganizations.length > 0 ? (
          filteredOrganizations.map((org) => (
            <Card
              key={org.name}
              className="transition-transform hover:scale-105 hover:cursor-pointer"
            >
              <Link href={`organization/${org.id}`}>
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>{org.description}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))
        ) : (
          <div>No organizations found.</div>
        )}
      </div>
    </div>
  );
}
