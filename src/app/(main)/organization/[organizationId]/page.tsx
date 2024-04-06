import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

export default async function Organization({
  params,
}: {
  params: { organizationId: string };
}) {
  const organization = await api.organization.byId({
    organizationId: Number(params.organizationId),
  });

  if (!organization) {
    return redirect("/");
  }

  return (
    <main className="mx-auto flex max-w-screen-sm p-4">
      <div className="flex flex-col gap-4">
        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-100 bg-clip-text text-4xl font-semibold text-transparent">
          {organization?.name}
        </h1>
        <p>{organization?.description}</p>
      </div>
    </main>
  );
}
