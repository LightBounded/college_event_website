import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Events() {
  return (
    <>
      {events.map((event) => (
        <Card key={event.name} className="w-[300px] lg:w-[600px]">
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </>
  );
}

const events = [
  {
    name: "Event Name 1",
    description: "Event Description 1",
  },
  {
    name: "Event Name 2",
    description: "Event Description 2",
  },
  {
    name: "Event Name 3",
    description: "Event Description 3",
  },
  {
    name: "Event Name 4",
    description: "Event Description 4",
  },
  {
    name: "Event Name 5",
    description: "Event Description 5",
  },
];
