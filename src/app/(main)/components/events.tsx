"use client";

import { useState } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search events"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex h-9 w-1/2 rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />

      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <Card
            key={event.name}
            className="w-[300px] transition-transform hover:scale-x-105 hover:cursor-pointer lg:w-[600px]"
          >
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
          </Card>
        ))
      ) : (
        <div className="w-[300px] lg:w-[600px]">No events found.</div>
      )}
    </>
  );
}

const events = [
  {
    name: "Event Name 1",
    description: "Event Description 1",
  },
  {
    name: "Event Name 2",
    description: "Event Description 2",
  },
  {
    name: "Event Name 3",
    description: "Event Description 3",
  },
  {
    name: "Event Name 4",
    description: "Event Description 4",
  },
  {
    name: "Event Name 5",
    description: "Event Description 5",
  },
];
