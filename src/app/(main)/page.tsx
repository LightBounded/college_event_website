import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Events from "./components/events";
import Organizations from "./components/organizations";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-row justify-center p-4">
      <Tabs defaultValue="organizations" className="w-auto">
        {/* content for when org tab is open */}
        <TabsContent value="organizations" className="flex flex-col gap-4">
          <div className="flex flex-row gap-8">
            <TabsList>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col gap-4">
            <Organizations />
          </div>
        </TabsContent>
        {/* content for when events tab is open */}
        <TabsContent value="events" className="flex flex-col gap-4">
          <div className="flex flex-row gap-8">
            <TabsList>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col gap-4">
            <Events />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
