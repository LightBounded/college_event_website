import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { UNIVERSITIES } from "~/consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUniversityFromEmail(email: string) {
  const acronym = email.split("@")[1]?.split(".")[0];

  if (!acronym) {
    throw new Error("Invalid email");
  }

  return UNIVERSITIES.find((school) => school.acronym === acronym)!;
}
