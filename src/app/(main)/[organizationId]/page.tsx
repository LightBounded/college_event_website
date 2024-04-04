export default function page({
  params,
}: {
  params: { organizationId: string };
}) {
  return <div>This is organization of id {params.organizationId}</div>;
}
