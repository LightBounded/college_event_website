import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function Organizations() {
  return (
    <>
      {organizations.map((organization) => (
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

const organizations = [
  {
    name: "Club Name 1",
    description: "Club Description 1",
  },
  {
    name: "Club Name 2",
    description: "Club Description 2",
  },
  {
    name: "Club Name 3",
    description: "Club Description 3",
  },
  {
    name: "Club Name 4",
    description: "Club Description 4",
  },
  {
    name: "Club Name 5",
    description: "Club Description 5",
  },
];
