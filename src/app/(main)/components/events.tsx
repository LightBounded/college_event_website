import { SCHOOLS } from "~/consts";
import { validateRequest } from "~/server/auth/validate-request";
import { api } from "~/trpc/server";
import { EventsList } from "./events-list";

export default async function Events() {
  const { user } = await validateRequest();

  const acronym = user?.email
    .split("@")[1]
    ?.split(".")[0] as (typeof SCHOOLS)[number]["acronym"];
  const school = SCHOOLS.find((school) => school.acronym === acronym)!;

  const promise = api.event.allByUniversityName({
    universityName: school.name,
  });

  return <EventsList universityName={school.name} promise={promise} />;
}
