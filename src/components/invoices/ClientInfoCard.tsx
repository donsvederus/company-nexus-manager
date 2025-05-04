
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types/client";

interface ClientInfoCardProps {
  clients: Client[];
  selectedClientId: string;
  selectedClient: Client | null;
  onClientSelect: (clientId: string) => void;
}

export function ClientInfoCard({
  clients,
  selectedClientId,
  selectedClient,
  onClientSelect
}: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="clientSelect">Select Client</label>
            <Select 
              value={selectedClientId} 
              onValueChange={onClientSelect}
            >
              <SelectTrigger id="clientSelect" className="mt-1">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClient && (
            <div className="border p-4 rounded-md bg-muted/50">
              <h3 className="font-medium">{selectedClient.companyName}</h3>
              <p className="text-sm">{selectedClient.mainContact}</p>
              <p className="text-sm">{selectedClient.email}</p>
              <p className="text-sm">{selectedClient.phone}</p>
              <p className="text-sm">
                {selectedClient.street}, {selectedClient.city}, {selectedClient.state} {selectedClient.zipCode}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
