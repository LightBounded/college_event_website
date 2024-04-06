import { api } from "~/trpc/server";

export default async function page({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await api.event.byId({
    eventId: Number(params.eventId),
  });

  return (
    <main className="flex min-h-screen flex-row justify-center p-4">
      <div className="flex flex-col gap-4 sm:w-[400px]">
        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-100 bg-clip-text text-4xl font-semibold text-transparent">
          {/* {events?.map((event) => event.name).join(", ")} */}
          {event?.name}
        </h1>
        <h2>{event?.description}</h2>
      </div>
    </main>
  );
}
