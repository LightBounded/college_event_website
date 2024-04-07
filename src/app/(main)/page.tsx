import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import { CreateOrganizationSheet } from "./_components/create-organization-sheet";
import Events from "./_components/events";
import Organizations from "./_components/organizations";

export default async function Home() {
  const user = await api.user.current();

  return (
    <main className="mx-auto flex max-w-screen-sm p-4">
      <Tabs defaultValue="organizations" className="w-full">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          {user!.administeredUniversity && (
            <CreateOrganizationSheet
              university={user!.administeredUniversity}
            />
          )}
        </div>

        <TabsContent value="organizations">
          <Organizations />
        </TabsContent>
        <TabsContent value="events">
          <Events />
        </TabsContent>
      </Tabs>
    </main>
  );
}
