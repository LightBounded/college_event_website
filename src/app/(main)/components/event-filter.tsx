import { RadioGroup } from "~/components/ui/radio-group";
import Eventsearch from "./event-search";

export default async function Eventfilter() {
  return (
    <RadioGroup defaultValue="option-one" className="flex flex-col">
      <div className="flex items-center space-x-2">
        <Eventsearch />
      </div>
    </RadioGroup>
  );
}
