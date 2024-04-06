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
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export function EventsList({
  universityName,
  promise,
}: {
  universityName: (typeof SCHOOLS)[number]["name"];
  promise: Promise<RouterOutputs["event"]["allByUniversityName"]>;
}) {
  const eventsFromServer = use(promise);
  const allEvents = api.event.allByUniversityName.useQuery(
    {
      universityName,
    },
    {
      initialData: eventsFromServer,
    },
  );
  const [search, setSearch] = useState("");

  const filteredEvents = allEvents.data.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Input
        className="mb-2"
        placeholder="Search for an event"
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <Card
            key={event.name}
            className="transition-transform hover:scale-105 hover:cursor-pointer"
          >
            <Link href={"/event/" + event.id}>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))
      ) : (
        <div>No events found.</div>
      )}
    </div>
  );
}
