import React, { createContext, useContext, useState, useEffect } from "react";
import { Client, ClientStatus } from "@/types/client";
import { toast } from "sonner";

// Sample initial data
const initialClients: Client[] = [
  {
    id: "1",
    companyName: "Acme Corporation",
    address: "123 Main St, Anytown, USA",
    accountManager: "Jane Smith",
    mainContact: "John Doe",
    email: "john.doe@acme.com",
    phone: "(555) 123-4567",
    startDate: "2022-01-15",
    status: "active",
  },
  {
    id: "2",
    companyName: "Globex Industries",
    address: "456 Tech Blvd, Innovation City, USA",
    accountManager: "Michael Johnson",
    mainContact: "Sarah Williams",
    email: "sarah@globex.com",
    phone: "(555) 987-6543",
    startDate: "2021-06-22",
    status: "inactive",
  },
  {
    id: "3",
    companyName: "Wayne Enterprises",
    address: "1007 Mountain Drive, Gotham City, USA",
    accountManager: "Bruce Wayne",
    mainContact: "Lucius Fox",
    email: "lucius.fox@wayne.com",
    phone: "(555) 228-6283",
    startDate: "2020-03-30",
    status: "active",
  },
];

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  updateClientStatus: (id: string, status: ClientStatus) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    // Try to load clients from localStorage on initial render
    const savedClients = localStorage.getItem("clients");
    return savedClients ? JSON.parse(savedClients) : initialClients;
  });

  // Save clients to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const addClient = (clientData: Omit<Client, "id">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(), // Simple ID generation
    };
    setClients((prevClients) => [...prevClients, newClient]);
    toast.success("Client added successfully");
  };

  const updateClient = (updatedClient: Client) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    toast.success("Client updated successfully");
  };

  const deleteClient = (id: string) => {
    setClients((prevClients) => prevClients.filter((client) => client.id !== id));
    toast.success("Client deleted successfully");
  };

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  const updateClientStatus = (id: string, status: ClientStatus) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === id ? { ...client, status } : client
      )
    );
    
    const statusMessages = {
      active: "Client activated successfully",
      inactive: "Client deactivated successfully"
    };
    
    toast.success(statusMessages[status]);
  };

  const value = {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    updateClientStatus,
  };

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientProvider");
  }
  return context;
};
