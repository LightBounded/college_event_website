import { RadioGroup } from "~/components/ui/radio-group";
import Orgsearch from "./org-search";

export default async function Orgfilter() {
  return (
    <RadioGroup className="flex flex-col">
      <div className="mb-4 flex items-center space-x-2">
        <Orgsearch />
      </div>
    </RadioGroup>
  );
}
