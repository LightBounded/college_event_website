import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import { Comments } from "./comments";
import { CreateCommentForm } from "./create-comment-form";

export default async function Event({
  params,
}: {
  params: { eventId: string };
}) {
  const user = await api.user.current();
  const event = await api.event.byId({ eventId: Number(params.eventId) });

  if (!event) {
    return redirect("/");
  }

  return (
    <main className="mx-auto max-w-screen-sm p-4">
      <div className="mb-8 flex flex-col">
        <h1 className="mb-4 bg-gradient-to-r from-violet-600 to-indigo-100 bg-clip-text text-4xl font-semibold text-transparent">
          {event.name}
        </h1>
        <p>{event.description}</p>
      </div>
      <h1 className="mb-4 text-2xl font-bold">Comments</h1>
      {user?.members.some(
        (member) => member.organizationId === event.organizationId,
      ) && <CreateCommentForm event={event} />}
      <Comments user={user} event={event} />
    </main>
  );
}
