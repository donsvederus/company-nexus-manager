
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/service";
import { formatCurrency } from "@/utils/formatUtils";

interface ServiceCardProps {
  service: Service;
  isAssigned: boolean;
  onAddService: (serviceId: string) => void;
}

export const ServiceCard = ({ service, isAssigned, onAddService }: ServiceCardProps) => {
  return (
    <Card className={`border ${isAssigned ? 'border-green-300 bg-green-50' : ''}`}>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{service.name}</CardTitle>
        <Badge variant="outline" className="capitalize w-fit">
          {service.category}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm text-muted-foreground mb-2">
          {service.description || "No description available"}
        </div>
        <div className="font-bold mb-4">
          {formatCurrency(service.defaultCost)}
          <span className="text-xs text-muted-foreground ml-1">default</span>
        </div>
        <Button 
          className="w-full" 
          variant={isAssigned ? "outline" : "default"}
          onClick={() => onAddService(service.id)}
          disabled={isAssigned}
        >
          {isAssigned ? "Already Added" : "Add Service"}
        </Button>
      </CardContent>
    </Card>
  );
};
