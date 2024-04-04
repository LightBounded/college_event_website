import { RadioGroup } from "~/components/ui/radio-group";
import Orgsearch from "./org-search";

export default async function Orgfilter() {
  return (
    <RadioGroup defaultValue="option-one" className="flex flex-col">
      <div className="flex items-center space-x-2">
        <Orgsearch />
      </div>
    </RadioGroup>
  );
}
