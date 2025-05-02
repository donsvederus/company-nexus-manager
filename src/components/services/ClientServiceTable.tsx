
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Save } from "lucide-react";
import { ServiceActionButtons } from "./ServiceActionButtons";
import { Service, ClientService } from "@/types/service";
import { formatCurrency, getFinalCost } from "@/utils/formatUtils";
import { Client } from "@/types/client";

interface ClientServiceTableProps {
  clientServices: ClientService[];
  getServiceDetails: (serviceId: string) => Service | undefined;
  client: Client;
  onSaveCustomCost: (serviceId: string, cost: number | undefined, notes: string, domain: string) => void;
  onDuplicate: (clientServiceId: string) => void;
  onDelete: (clientServiceId: string) => void;
  onToggleStatus: (clientServiceId: string, isActive: boolean) => void;
}

export const ClientServiceTable = ({
  clientServices,
  getServiceDetails,
  client,
  onSaveCustomCost,
  onDuplicate,
  onDelete,
  onToggleStatus
}: ClientServiceTableProps) => {
  const [editingService, setEditingService] = useState<string | null>(null);
  const [customCost, setCustomCost] = useState<number | ''>('');
  const [serviceNotes, setServiceNotes] = useState<string>('');
  const [serviceDomain, setServiceDomain] = useState<string>('');

  const startEditing = (serviceId: string) => {
    const clientService = clientServices.find(cs => cs.serviceId === serviceId);
    setEditingService(serviceId);
    setCustomCost(clientService?.customCost ?? '');
    setServiceNotes(clientService?.notes ?? '');
    setServiceDomain(clientService?.domain || client?.website || '');
  };

  const handleSaveCustomCost = () => {
    if (editingService) {
      onSaveCustomCost(
        editingService, 
        customCost === '' ? undefined : Number(customCost),
        serviceNotes,
        serviceDomain
      );
      
      // Reset editing state
      setEditingService(null);
      setCustomCost('');
      setServiceNotes('');
      setServiceDomain('');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-40">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientServices.map((clientService) => {
          const service = getServiceDetails(clientService.serviceId);
          if (!service) return null;
          
          const isEditing = editingService === clientService.serviceId;
          
          return (
            <TableRow key={clientService.id} className={!clientService.isActive ? "opacity-60" : ""}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {service.category}
                </Badge>
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    value={serviceDomain}
                    onChange={(e) => setServiceDomain(e.target.value)}
                    className="w-32"
                    placeholder={client.website || "example.com"}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {clientService.domain || client.website || "-"}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Custom cost (optional)"
                      value={customCost}
                      onChange={(e) => setCustomCost(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {formatCurrency(getFinalCost(service.defaultCost, clientService.customCost))}
                    {clientService.customCost !== undefined && (
                      <Badge variant="outline" className="text-xs">Custom</Badge>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    placeholder="Notes (optional)"
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {clientService.notes || "-"}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={clientService.isActive ? "default" : "secondary"} 
                  className={clientService.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {clientService.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Button size="sm" variant="outline" onClick={handleSaveCustomCost} className="flex items-center gap-1">
                    <Save className="h-4 w-4" /> Save
                  </Button>
                ) : (
                  <ServiceActionButtons
                    serviceId={clientService.serviceId}
                    clientServiceId={clientService.id}
                    isActive={clientService.isActive}
                    onEdit={startEditing}
                    onDuplicate={onDuplicate}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
