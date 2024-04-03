"use client";

import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";

export default function Eventsearch() {
  const [showCommandList, setShowCommandList] = useState(false);

  return (
    <Command className="w-[250px] rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search for an event..."
        onFocus={() => setShowCommandList(true)}
        onBlur={() => setShowCommandList(false)}
      />
      {showCommandList && (
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {events.slice(0, 3).map((event) => (
              <CommandItem key={event.name}>
                <span>{event.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      )}
    </Command>
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
