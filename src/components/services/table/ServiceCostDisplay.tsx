
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getFinalCost } from "@/utils/formatUtils";

interface ServiceCostDisplayProps {
  defaultCost: number;
  customCost?: number;
}

export const ServiceCostDisplay = ({ defaultCost, customCost }: ServiceCostDisplayProps) => {
  const finalCost = getFinalCost(defaultCost, customCost);

  return (
    <div className="flex items-center gap-2">
      {formatCurrency(finalCost)}
      {customCost !== undefined && (
        <Badge variant="outline" className="text-xs">Custom</Badge>
      )}
    </div>
  );
};
