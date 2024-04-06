import { redirect } from "next/navigation";

import { SCHOOLS } from "~/consts";
import { validateRequest } from "~/server/auth/validate-request";
import { api } from "~/trpc/server";
import { OrganizationsList } from "./organizations-list";

export default async function Events() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/sign-in");
  }

  const acronym = user.email
    .split("@")[1]
    ?.split(".")[0] as (typeof SCHOOLS)[number]["acronym"];
  const school = SCHOOLS.find((school) => school.acronym === acronym)!;

  const promise = api.organization.allByUniversityName({
    universityName: school.name,
  });

  return <OrganizationsList universityName={school.name} promise={promise} />;
}
