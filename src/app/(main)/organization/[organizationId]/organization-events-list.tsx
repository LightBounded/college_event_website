"use client";

import Link from "next/link";
import { CalendarIcon, DrawingPinFilledIcon } from "@radix-ui/react-icons";

import type { RouterOutputs } from "~/server/api/root";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function OrganizationEventsList({
  organization,
}: {
  organization: NonNullable<RouterOutputs["organization"]["byId"]>;
}) {
  const allEvents = api.event.allByOrganizationId.useQuery(
    {
      organizationId: organization.id,
    },
    {
      initialData: organization.events,
    },
  );

  return (
    <div className="flex flex-col gap-2">
      {allEvents.data.length > 0 ? (
        allEvents.data.map((event) => (
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
              </CardContent>
            </Link>
          </Card>
        ))
      ) : (
        <div>No events found.</div>
      )}
    </div>
  );
}
