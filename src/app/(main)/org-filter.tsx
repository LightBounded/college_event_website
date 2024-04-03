import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import Orgsearch from "./org-search";

export default async function Orgfilter() {
  return (
    <RadioGroup defaultValue="option-one" className="flex flex-col">
      <div className="mb-4 flex items-center space-x-2">
        <Orgsearch />
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Social</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Athletic</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Entertainment</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-four" id="option-four" />
        <Label htmlFor="option-four">Educational</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-five" id="option-five" />
        <Label htmlFor="option-five">Spiritual/Religious</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-six" id="option-six" />
        <Label htmlFor="option-six">Fundraising</Label>
      </div>
    </RadioGroup>
  );
}
