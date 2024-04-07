"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  DrawingPinFilledIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import type { UNIVERSITIES } from "~/consts";
import type { RouterOutputs } from "~/server/api/root";
import {
  Card,
  CardContent,
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
  universityName: (typeof UNIVERSITIES)[number]["name"];
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
        <div className="flex flex-col gap-2">
          {filteredEvents.map((event) => (
            <Card
              key={event.name}
              className="transition-transform hover:scale-105 hover:cursor-pointer"
            >
              <Link href={`/event/${event.id}`}>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-0.5 text-sm">
                  <div className="flex items-center gap-2">
                    <DrawingPinFilledIcon />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <span>
                      {event.date} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PersonIcon />
                    <span>
                      Hosted by <b>{event.organization.name}</b>
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div>No events found.</div>
      )}
    </div>
  );
}
