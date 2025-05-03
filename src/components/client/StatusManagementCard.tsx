
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Client, ClientStatus } from "@/types/client";
import StatusBadge from "@/components/StatusBadge";
import { useClients } from "@/context/ClientContext";

interface StatusManagementCardProps {
  client: Client;
  onStatusChange: (client: Client) => void;
}

export default function StatusManagementCard({ client, onStatusChange }: StatusManagementCardProps) {
  const { updateClientStatus } = useClients();

  const handleStatusChange = (newStatus: ClientStatus) => {
    updateClientStatus(client.id, newStatus);
    onStatusChange({
      ...client,
      status: newStatus,
      // If setting to inactive, add end date; if active, remove end date
      ...(newStatus === 'inactive' 
        ? { endDate: new Date().toISOString().split('T')[0] }
        : { endDate: undefined })
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Current status:</p>
            <StatusBadge status={client?.status as ClientStatus} />
          </div>
          <div className="space-y-3 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange("active")}
                    disabled={client?.status === "active"}
                  >
                    Set as Active
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark this client as currently active</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700" 
                    onClick={() => handleStatusChange("inactive")}
                    disabled={client?.status === "inactive"}
                  >
                    Set as Inactive
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark this client as inactive. Limited functionality will be available.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
