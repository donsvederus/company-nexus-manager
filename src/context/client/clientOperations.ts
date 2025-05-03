
import { Client, ClientStatus } from "@/types/client";
import { toast } from "sonner";

export const addClient = (
  clients: Client[], 
  setClients: React.Dispatch<React.SetStateAction<Client[]>>, 
  clientData: Omit<Client, "id">
) => {
  const newClient: Client = {
    ...clientData,
    id: Date.now().toString(), // Simple ID generation
  };
  setClients((prevClients) => [...prevClients, newClient]);
  toast.success("Client added successfully");
  return newClient;
};

export const updateClient = (
  clients: Client[], 
  setClients: React.Dispatch<React.SetStateAction<Client[]>>, 
  updatedClient: Client
) => {
  setClients((prevClients) =>
    prevClients.map((client) =>
      client.id === updatedClient.id ? updatedClient : client
    )
  );
  toast.success("Client updated successfully");
  return updatedClient;
};

export const deleteClient = (
  clients: Client[], 
  setClients: React.Dispatch<React.SetStateAction<Client[]>>, 
  id: string
) => {
  setClients((prevClients) => prevClients.filter((client) => client.id !== id));
  toast.success("Client deleted successfully");
};

export const getClientById = (
  clients: Client[], 
  id: string
) => {
  return clients.find((client) => client.id === id);
};

export const updateClientStatus = (
  clients: Client[], 
  setClients: React.Dispatch<React.SetStateAction<Client[]>>, 
  id: string, 
  status: ClientStatus
) => {
  setClients((prevClients) =>
    prevClients.map((client) => {
      if (client.id === id) {
        // If setting to inactive, add end date; if active, remove end date
        if (status === 'inactive') {
          return { 
            ...client, 
            status,
            endDate: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
          };
        } else {
          // Remove endDate when setting to active
          const { endDate, ...clientWithoutEndDate } = client;
          return { ...clientWithoutEndDate, status };
        }
      }
      return client;
    })
  );
  
  const statusMessages = {
    active: "Client activated successfully",
    inactive: "Client deactivated successfully"
  };
  
  toast.success(statusMessages[status]);
};

export const updateLastContactDate = (
  clients: Client[], 
  setClients: React.Dispatch<React.SetStateAction<Client[]>>, 
  id: string, 
  date?: Date
) => {
  const formattedDate = date 
    ? date.toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  setClients((prevClients) =>
    prevClients.map((client) =>
      client.id === id ? { ...client, lastContactDate: formattedDate } : client
    )
  );
  
  toast.success("Last contact date updated successfully");
};
