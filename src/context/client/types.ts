
import { Client, ClientStatus } from "@/types/client";

export interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  updateClientStatus: (id: string, status: ClientStatus) => void;
  updateLastContactDate: (id: string, date?: Date) => void;
}
