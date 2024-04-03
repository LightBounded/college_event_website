import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Events() {
  return (
    <>
      {events.map((organization) => (
        <Card key={organization.name}>
          <CardHeader>
            <CardTitle>{organization.name}</CardTitle>
            <CardDescription>{organization.description}</CardDescription>
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
