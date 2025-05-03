
import { Badge } from "@/components/ui/badge";

interface ServiceStatusBadgeProps {
  isActive: boolean;
}

export const ServiceStatusBadge = ({ isActive }: ServiceStatusBadgeProps) => {
  return (
    <Badge 
      variant={isActive ? "default" : "secondary"} 
      className={isActive ? "bg-green-500 hover:bg-green-600" : ""}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
};
