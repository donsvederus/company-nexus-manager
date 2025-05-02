
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { ClientServiceTable } from "./ClientServiceTable";
import { NoServicesCard } from "./NoServicesCard";
import { Service, ClientService } from "@/types/service";
import { Client } from "@/types/client";

interface CurrentServicesTabProps {
  client: Client;
  clientServices: ClientService[];
  getServiceDetails: (serviceId: string) => Service | undefined;
  onAddClick: () => void;
  onSaveCustomCost: (serviceId: string, customCost: number | undefined, notes: string, domain: string) => void;
  onDuplicate: (clientServiceId: string) => void;
  onDelete: (clientServiceId: string) => void;
  onToggleStatus: (clientServiceId: string, isActive: boolean) => void;
}

export const CurrentServicesTab = ({
  client,
  clientServices,
  getServiceDetails,
  onAddClick,
  onSaveCustomCost,
  onDuplicate,
  onDelete,
  onToggleStatus
}: CurrentServicesTabProps) => {
  const [showInactiveServices, setShowInactiveServices] = useState(false);
  
  const getDisplayClientServices = () => {
    if (!showInactiveServices) {
      return clientServices.filter(cs => cs.isActive);
    }
    return clientServices;
  };

  const displayServices = getDisplayClientServices();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Client Services</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowInactiveServices(!showInactiveServices)}
          >
            {showInactiveServices ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide Inactive
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Show Inactive
              </>
            )}
          </Button>
        </div>
      </div>

      {displayServices.length === 0 ? (
        <NoServicesCard 
          showInactiveServices={showInactiveServices} 
          onAddClick={onAddClick} 
        />
      ) : (
        <Card>
          <CardContent className="p-4">
            <ClientServiceTable
              clientServices={displayServices}
              getServiceDetails={getServiceDetails}
              client={client}
              onSaveCustomCost={onSaveCustomCost}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
