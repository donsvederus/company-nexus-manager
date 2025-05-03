
import { Client } from "@/types/client";
import { initialClients } from "./data";

// Function to load clients from localStorage
export const loadClients = (): Client[] => {
  // Force initialClients to take precedence for this session
  localStorage.setItem("clients", JSON.stringify(initialClients));
  return initialClients;
};

// Function to save clients to localStorage
export const saveClients = (clients: Client[]) => {
  localStorage.setItem("clients", JSON.stringify(clients));
};
