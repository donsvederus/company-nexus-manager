
import React, { createContext, useState, useEffect } from "react";
import { Client, ClientStatus } from "@/types/client";
import { loadClients, saveClients } from "./clientStorage";
import { 
  addClient as addClientOp, 
  updateClient as updateClientOp,
  deleteClient as deleteClientOp,
  getClientById as getClientByIdOp,
  updateClientStatus as updateClientStatusOp,
  updateLastContactDate as updateLastContactDateOp
} from "./clientOperations";
import { ClientContextType } from "./types";

export const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with clients from localStorage or initial data
  const [clients, setClients] = useState<Client[]>(() => loadClients());

  // Save clients to localStorage whenever it changes
  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  const addClient = (clientData: Omit<Client, "id">) => {
    return addClientOp(clients, setClients, clientData);
  };

  const updateClient = (updatedClient: Client) => {
    return updateClientOp(clients, setClients, updatedClient);
  };

  const deleteClient = (id: string) => {
    deleteClientOp(clients, setClients, id);
  };

  const getClientById = (id: string) => {
    return getClientByIdOp(clients, id);
  };

  const updateClientStatus = (id: string, status: ClientStatus) => {
    updateClientStatusOp(clients, setClients, id, status);
  };

  const updateLastContactDate = (id: string, date?: Date) => {
    updateLastContactDateOp(clients, setClients, id, date);
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
