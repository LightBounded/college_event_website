import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { UNIVERSITIES } from "~/consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUniversityFromEmail(email: string) {
  const domain = email.split("@")[1];
  if (!domain?.endsWith(".edu")) {
    throw new Error("Invalid email");
  }

  const acronym = domain.split(".")[0];
  if (!acronym) {
    throw new Error("Invalid email");
  }

  return UNIVERSITIES.find((school) => school.acronym === acronym)!;
}
