
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface NoServicesCardProps {
  showInactiveServices: boolean;
  onAddClick: () => void;
}

export const NoServicesCard = ({ showInactiveServices, onAddClick }: NoServicesCardProps) => {
  return (
    <Card>
      <CardContent className="text-center p-6">
        <p className="text-muted-foreground mb-4">No {showInactiveServices ? "" : "active"} services assigned to this client</p>
        <Button onClick={onAddClick} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" /> Add Services
        </Button>
      </CardContent>
    </Card>
  );
};
