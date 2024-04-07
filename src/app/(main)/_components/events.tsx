import { validateRequest } from "~/server/auth/validate-request";
import { api } from "~/trpc/server";
import { EventsList } from "./events-list";

export default async function Events() {
  const { user } = await validateRequest();

  const promise = api.event.allByUniversityName({
    universityName: user!.university.name,
  });

  return (
    <EventsList universityName={user!.university.name} promise={promise} />
  );
}
