"use client";

import * as React from "react";
import { CheckIcon, ChevronUpIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { SCHOOLS } from "~/consts";
import { cn } from "~/lib/utils";

export function Schools() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? SCHOOLS.find((school) => school.acronym === value)?.name
            : "Select school..."}
          <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search school..." />
          <CommandEmpty>No school found.</CommandEmpty>
          <CommandGroup>
            {SCHOOLS.map((school) => (
              <CommandList key={school.acronym}>
                <CommandItem
                  key={school.name}
                  value={school.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === school.acronym ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {school.name}
                </CommandItem>
              </CommandList>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
