
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

interface ServiceCostInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ServiceCostInput = ({ value, onChange }: ServiceCostInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-32">
        <DollarSign className="h-4 w-4 absolute left-2 top-[11px] text-muted-foreground" />
        <Input
          placeholder="Custom cost"
          value={value}
          onChange={onChange}
          className="pl-8"
        />
      </div>
    </div>
  );
};
