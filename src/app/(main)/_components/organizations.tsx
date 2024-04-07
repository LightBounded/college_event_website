import { validateRequest } from "~/server/auth/validate-request";
import { api } from "~/trpc/server";
import { OrganizationsList } from "./organizations-list";

export default async function Events() {
  const { user } = await validateRequest();

  const promise = api.organization.allByUniversityName({
    universityName: user!.university.name,
  });

  return (
    <OrganizationsList
      universityName={user!.university.name}
      promise={promise}
    />
  );
}
