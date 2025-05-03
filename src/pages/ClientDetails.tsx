
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import { useAuth } from "@/context/AuthContext";
import { Client } from "@/types/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ClientServiceList from "@/components/ClientServiceList";
import BasicInfoCard from "@/components/client/BasicInfoCard";
import ContactInfoCard from "@/components/client/ContactInfoCard";
import StatusManagementCard from "@/components/client/StatusManagementCard";
import ClientDetailsHeader from "@/components/client/ClientDetailsHeader";

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, deleteClient, updateClient } = useClients();
  const { users } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  
  // Get account managers from users
  const accountManagers = Array.isArray(users) 
    ? users.filter(user => user.role === "admin" || user.role === "manager") 
    : [];

  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
        
        // Check if the client's account manager is in the valid list
        const isValidManager = accountManagers.length > 0 && accountManagers.some(
          manager => manager.name === foundClient.accountManager
        );
        
        // If not, update the client with a valid account manager
        if (!isValidManager && accountManagers.length > 0) {
          const updatedClient = {
            ...foundClient,
            accountManager: accountManagers[0].name
          };
          updateClient(updatedClient);
          setClient(updatedClient);
          toast.info("Client's account manager was updated to a valid manager");
        }
      } else {
        toast.error("Client not found");
        navigate("/clients");
      }
    }
  }, [id, getClientById, navigate, accountManagers, updateClient]);

  const handleDelete = () => {
    if (client) {
      deleteClient(client.id);
      toast.success("Client deleted successfully");
      navigate("/clients");
    }
  };

  const handleClientUpdate = (updatedClient: Client) => {
    setClient(updatedClient);
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientDetailsHeader 
        client={client} 
        onDelete={handleDelete} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Detailed information about {client?.companyName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <BasicInfoCard 
                  client={client} 
                  onClientUpdate={handleClientUpdate} 
                />
              </div>
              <div>
                <ContactInfoCard 
                  client={client} 
                  onClientUpdate={handleClientUpdate} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <StatusManagementCard 
          client={client} 
          onStatusChange={handleClientUpdate} 
        />
      </div>

      {client && <ClientServiceList client={client} />}
    </div>
  );
}
