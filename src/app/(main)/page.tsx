import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Eventfilter from "./components/event-filter";
import Events from "./components/events";
import Orgfilter from "./components/org-filter";
import Organizations from "./components/organizations";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-row justify-center p-4">
      <Tabs defaultValue="organizations" className="w-auto">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent
          value="organizations"
          className="flex flex-col gap-4 sm:flex-row"
        >
          <div className="flex flex-col gap-4">
            <Orgfilter />
          </div>
          <div className="flex flex-col gap-4">
            <Organizations />
          </div>
        </TabsContent>
        <TabsContent value="events" className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-4">
            <Eventfilter />
          </div>
          <div className="flex flex-col gap-4">
            <Events />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
