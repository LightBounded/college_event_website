import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
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
        <p className="mb-4">{organization.description}</p>
        <form>
          {user?.members.some(
            (member) => member.organizationId === organization.id,
          ) ? (
            <Button
              size="sm"
              formAction={async () => {
                "use server";
                await api.organization.leave({
                  organizationId: organization.id,
                });
                revalidatePath(`/organization/${organization.id}`);
              }}
            >
              Leave organization
            </Button>
          ) : (
            <Button
              size="sm"
              formAction={async () => {
                "use server";
                await api.organization.join({
                  organizationId: organization.id,
                });
                revalidatePath(`/organization/${organization.id}`);
              }}
            >
              Join organization
            </Button>
          )}
        </form>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-2xl font-bold">Events</div>
        {organization.adminId === user!.id && (
          <CreateEventSheet organization={organization} />
        )}
      </div>
      <OrganizationEventsList organization={organization} />
    </main>
  );
}
