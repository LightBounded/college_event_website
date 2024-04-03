import { RadioGroup } from "~/components/ui/radio-group";
import Eventsearch from "./event-search";

export default async function Eventfilter() {
  return (
    <RadioGroup defaultValue="option-one" className="flex flex-col">
      <div className="mb-4 flex flex-col items-center space-x-2">
        <Eventsearch />
      </div>
    </RadioGroup>
  );
}
