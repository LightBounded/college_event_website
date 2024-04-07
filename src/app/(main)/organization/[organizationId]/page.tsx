import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import { CreateEventSheet } from "./create-event-sheet";
import { OrganizationEventsList } from "./organization-events-list";

export default async function Organization({
  params,
}: {
  params: { organizationId: string };
}) {
  const user = await api.user.current();

  const organization = await api.organization.byId({
    organizationId: Number(params.organizationId),
  });

  if (!organization) {
    return redirect("/");
  }

  return (
    <main className="mx-auto max-w-screen-sm p-4">
      <div className="mb-8 flex flex-col">
        <h1 className="mb-4 bg-gradient-to-r from-violet-600 to-indigo-100 bg-clip-text text-4xl font-semibold text-transparent">
          {organization.name}
        </h1>
        <p>{organization.description}</p>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Events</h1>
          {user?.organizations.some(
            (org) => org.id === organization.id && org.admin,
          ) && <CreateEventSheet organization={organization} />}
        </div>
        <OrganizationEventsList organization={organization} />
      </div>
    </main>
  );
}
