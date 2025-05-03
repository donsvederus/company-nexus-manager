import React, { createContext, useContext, useState, useEffect } from "react";
import { Client, ClientStatus } from "@/types/client";
import { toast } from "sonner";

// Sample initial clients with updated address format
const initialClients: Client[] = [
  {
    id: "1",
    companyName: "Acme Corporation",
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    accountManager: "Jane Smith",
    mainContact: "John Doe",
    email: "john.doe@acme.com",
    phone: "(555) 123-4567",
    startDate: "2022-01-15",
    status: "active",
    lastContactDate: "2023-08-15"
  },
  {
    id: "2",
    companyName: "Globex Industries",
    street: "456 Tech Blvd",
    city: "Innovation City",
    state: "NY",
    zipCode: "67890",
    accountManager: "Michael Johnson",
    mainContact: "Sarah Williams",
    email: "sarah@globex.com",
    phone: "(555) 987-6543",
    startDate: "2021-06-22",
    status: "inactive",
    lastContactDate: "2023-05-22"
  },
  {
    id: "3",
    companyName: "Wayne Enterprises",
    street: "1007 Mountain Drive",
    city: "Gotham City",
    state: "NJ",
    zipCode: "10101",
    accountManager: "Bruce Wayne",
    mainContact: "Lucius Fox",
    email: "lucius.fox@wayne.com",
    phone: "(555) 228-6283",
    startDate: "2020-03-30",
    status: "active",
  },
  {
    id: "4",
    companyName: "Stark Industries",
    street: "200 Park Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10166",
    accountManager: "Pepper Potts",
    mainContact: "Tony Stark",
    email: "tony@stark.com",
    phone: "(555) 462-7865",
    startDate: "2019-11-12",
    status: "active",
  },
  {
    id: "5",
    companyName: "Oscorp",
    street: "888 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    accountManager: "Harry Osborn",
    mainContact: "Norman Osborn",
    email: "norman@oscorp.com",
    phone: "(555) 672-9090",
    startDate: "2021-02-18",
    status: "active",
  },
  {
    id: "6",
    companyName: "Umbrella Corporation",
    street: "765 Research Pkwy",
    city: "Raccoon City",
    state: "CO",
    zipCode: "80202",
    accountManager: "Albert Wesker",
    mainContact: "William Birkin",
    email: "birkin@umbrella.com",
    phone: "(555) 333-2211",
    startDate: "2018-07-23",
    status: "active",
  },
  {
    id: "7",
    companyName: "Cyberdyne Systems",
    street: "18144 El Camino Real",
    city: "Sunnyvale",
    state: "CA",
    zipCode: "94087",
    accountManager: "Miles Dyson",
    mainContact: "Miles Bennett Dyson",
    email: "dyson@cyberdyne.com",
    phone: "(555) 789-4561",
    startDate: "2020-08-29",
    status: "active",
  },
  {
    id: "8",
    companyName: "Initech",
    street: "4120 Freidrich Lane",
    city: "Austin",
    state: "TX",
    zipCode: "73301",
    accountManager: "Bill Lumbergh",
    mainContact: "Peter Gibbons",
    email: "peter@initech.com",
    phone: "(555) 222-3333",
    startDate: "2022-05-12",
    status: "active",
    website: "initech.com"
  },
  {
    id: "9",
    companyName: "Massive Dynamic",
    street: "555 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10012",
    accountManager: "Nina Sharp",
    mainContact: "Walter Bishop",
    email: "walter@massivedynamic.com",
    phone: "(555) 444-5555",
    startDate: "2021-11-02",
    status: "active",
    website: "massivedynamic.com"
  },
  {
    id: "10",
    companyName: "Hooli",
    street: "1401 N Shoreline Blvd",
    city: "Mountain View",
    state: "CA",
    zipCode: "94043",
    accountManager: "Gavin Belson",
    mainContact: "Jared Dunn",
    email: "jared@hooli.com",
    phone: "(555) 666-7777",
    startDate: "2022-07-18",
    status: "active",
    website: "hooli.com"
  },
  {
    id: "11",
    companyName: "Pied Piper",
    street: "5230 Newell Road",
    city: "Palo Alto",
    state: "CA",
    zipCode: "94303",
    accountManager: "Monica Hall",
    mainContact: "Richard Hendricks",
    email: "richard@piedpiper.com",
    phone: "(555) 888-9999",
    startDate: "2023-01-05",
    status: "active",
    website: "piedpiper.com"
  },
  {
    id: "12",
    companyName: "Soylent Corp",
    street: "101 Future Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    accountManager: "Henry Santoro",
    mainContact: "William Simonson",
    email: "william@soylent.com",
    phone: "(555) 000-1111",
    startDate: "2022-09-22",
    status: "active",
    website: "soylent.com"
  }
];

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  updateClientStatus: (id: string, status: ClientStatus) => void;
  updateLastContactDate: (id: string, date?: Date) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Ensure we always initialize with initialClients on first load, and then check localStorage
  const [clients, setClients] = useState<Client[]>(() => {
    // Force initialClients to take precedence for this session
    localStorage.setItem("clients", JSON.stringify(initialClients));
    return initialClients;
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

  const updateLastContactDate = (id: string, date?: Date) => {
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

  const value = {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    updateClientStatus,
    updateLastContactDate,
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
