import { getUniversityFromEmail } from "~/lib/utils";
import { validateRequest } from "~/server/auth/validate-request";
import { api } from "~/trpc/server";
import { EventsList } from "./events-list";

export default async function Events() {
  const { user } = await validateRequest();

  const school = getUniversityFromEmail(user!.email);

  const promise = api.event.allByUniversityName({
    universityName: school.name,
  });

  return <EventsList universityName={school.name} promise={promise} />;
}
