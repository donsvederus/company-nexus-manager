
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
import { Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatusManagementCardProps {
  client: Client;
  onStatusChange: (newStatus: ClientStatus) => void;
}

export default function StatusManagementCard({ client, onStatusChange }: StatusManagementCardProps) {
  const { updateClientStatus } = useClients();
  const navigate = useNavigate();

  const handleStatusChange = (newStatus: ClientStatus) => {
    updateClientStatus(client.id, newStatus);
    onStatusChange(newStatus);
  };

  const handleWorkLogClick = () => {
    navigate(`/clients/${client.id}/worklog`);
  };
  
  const handleNotesClick = () => {
    navigate(`/clients/${client.id}/notes`);
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

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleWorkLogClick}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Manage Work Log
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track time and add notes for work done with this client</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleNotesClick}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Client Notes
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add and manage client notes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
