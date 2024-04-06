import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { SCHOOLS } from "~/consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSchoolFromEmail(email: string) {
  const acronym = email.split("@")[1]?.split(".")[0];

  return SCHOOLS.find((school) => school.acronym === acronym)!;
}
