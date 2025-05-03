
import { Client } from "@/types/client";

interface FormattedAddressProps {
  client: Client;
}

export function FormattedAddress({ client }: FormattedAddressProps) {
  // Check if we have the new address fields
  if (client.street !== undefined) {
    return (
      <div className="text-sm text-right">
        <div>{client.street}</div>
        <div>{client.city}</div>
        <div>{client.state}, {client.zipCode}</div>
      </div>
    );
  } 
  
  return <span className="text-sm text-muted-foreground">Not specified</span>;
}
