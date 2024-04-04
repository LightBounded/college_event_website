"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Organizations() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = organizations.filter((org) =>
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
        <div className="w-[300px] lg:w-[600px]">No events found.</div>
      )}
    </>
  );
}

const organizations = [
  {
    name: "Meow Club",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    id: 1,
  },
  {
    name: "Club Name 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    id: 2,
  },
  {
    name: "Club Name 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    id: 3,
  },
  {
    name: "Club Name 4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    id: 4,
  },
  {
    name: "Club Name 5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    id: 5,
  },
];
