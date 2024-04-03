import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Eventfilter from "./event-filter";
import Events from "./events";
import Orgfilter from "./org-filter";
import Organizations from "./organizations";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-row justify-center p-4">
      <Tabs defaultValue="organizations" className="w-auto">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="organizations" className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <Organizations />
          </div>
          <Orgfilter />
        </TabsContent>
        <TabsContent value="events" className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <Events />
          </div>
          <Eventfilter />
        </TabsContent>
      </Tabs>
    </main>
  );
}
