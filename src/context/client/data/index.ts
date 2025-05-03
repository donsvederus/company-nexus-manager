
// Export all client data from this file
import { Client } from "@/types/client";
import { techClients } from "./techClients";
import { serviceClients } from "./serviceClients";
import { entertainmentClients } from "./entertainmentClients";
import { corporateClients } from "./corporateClients";

// Combine all client data
export const initialClients: Client[] = [
  ...techClients,
  ...serviceClients,
  ...entertainmentClients,
  ...corporateClients
];
