import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Events from "./events";
import Organizations from "./organizations";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Organizations</TabsTrigger>
          <TabsTrigger value="password">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Organizations />
        </TabsContent>
        <TabsContent value="password">
          <Events />
        </TabsContent>
      </Tabs>
    </main>
  );
}
