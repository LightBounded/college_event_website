import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

export default async function Event({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await api.event.byId({ eventId: Number(params.eventId) });

  if (!event) {
    return redirect("/");
  }

  return (
    <main className="mx-auto flex max-w-screen-sm p-4">
      <div className="flex flex-col gap-4">
        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-100 bg-clip-text text-4xl font-semibold text-transparent">
          {event?.name}
        </h1>
        <p>{event?.description}</p>
      </div>
    </main>
  );
}
