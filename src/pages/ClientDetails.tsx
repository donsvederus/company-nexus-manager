
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import { Client, ClientStatus } from "@/types/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClientStatus, deleteClient } = useClients();
  const [client, setClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
      } else {
        toast.error("Client not found");
        navigate("/clients");
      }
    }
  }, [id, getClientById, navigate]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ClientStatus) => {
    if (client) {
      updateClientStatus(client.id, newStatus);
      setClient({ ...client, status: newStatus });
    }
  };

  const handleDelete = () => {
    if (client) {
      deleteClient(client.id);
      toast.success("Client deleted successfully");
      navigate("/clients");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/clients")}>
            Back to List
          </Button>
          <Button variant="outline" asChild>
            <a href={`/clients/${id}/edit`}>Edit Client</a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Client</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the client
                  record from your system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Detailed information about {client.companyName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <InfoItem label="Company Name" value={client.companyName} />
                  <InfoItem label="Address" value={client.address} />
                  <InfoItem label="Start Date" value={new Date(client.startDate).toLocaleDateString()} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <StatusBadge status={client.status as ClientStatus} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <InfoItem label="Account Manager" value={client.accountManager} />
                  <InfoItem label="Main Contact" value={client.mainContact} />
                  <InfoItem label="Email" value={client.email} />
                  <InfoItem label="Phone" value={client.phone} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Current status:</p>
                <StatusBadge status={client.status as ClientStatus} />
              </div>
              <div className="space-y-3 pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange("active")}
                        disabled={client.status === "active"}
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
                        disabled={client.status === "inactive"}
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
                        className="w-full bg-amber-600 hover:bg-amber-700" 
                        onClick={() => handleStatusChange("reactivated")}
                        disabled={client.status === "reactivated"}
                      >
                        Reactivate Client
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reactivate a previously inactive client</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
