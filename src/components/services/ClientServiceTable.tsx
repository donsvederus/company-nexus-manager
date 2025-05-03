
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Save, DollarSign } from "lucide-react";
import { ServiceActionButtons } from "./ServiceActionButtons";
import { Service, ClientService } from "@/types/service";
import { formatCurrency, getFinalCost } from "@/utils/formatUtils";
import { Client } from "@/types/client";

interface ClientServiceTableProps {
  clientServices: ClientService[];
  getServiceDetails: (serviceId: string) => Service | undefined;
  client: Client;
  onSaveCustomCost: (clientServiceId: string, cost: number | undefined, notes: string, domain: string) => void;
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
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [customCost, setCustomCost] = useState<string>('');
  const [serviceNotes, setServiceNotes] = useState<string>('');
  const [serviceDomain, setServiceDomain] = useState<string>('');

  const startEditing = (clientServiceId: string) => {
    const clientService = clientServices.find(cs => cs.id === clientServiceId);
    if (clientService) {
      setEditingServiceId(clientServiceId);
      // Load existing values or use defaults
      setCustomCost(clientService.customCost !== undefined ? clientService.customCost.toString() : '');
      setServiceNotes(clientService.notes || '');
      // Use existing domain, or fall back to client website if domain is empty
      setServiceDomain(clientService.domain || client?.website || '');
    }
  };

  const handleSaveCustomCost = () => {
    if (editingServiceId) {
      // Convert customCost string to number or undefined
      const costValue = customCost === '' ? undefined : parseFloat(customCost);
      
      onSaveCustomCost(
        editingServiceId,
        costValue,
        serviceNotes,
        serviceDomain || client.website || '' // Ensure domain has a value, preferring serviceDomain but falling back to client website
      );
      
      // Reset editing state
      setEditingServiceId(null);
    }
  };
  
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      return; // Don't update if multiple decimal points
    }

    // Ensure only 2 decimal places max
    if (parts.length > 1 && parts[1].length > 2) {
      return; // Don't update if more than 2 decimal places
    }
    
    setCustomCost(value);
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
          
          const isEditing = editingServiceId === clientService.id;
          const displayDomain = clientService.domain || client.website || "-";
          
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
                    {displayDomain}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <div className="relative w-32">
                      <DollarSign className="h-4 w-4 absolute left-2 top-[11px] text-muted-foreground" />
                      <Input
                        placeholder="Custom cost"
                        value={customCost}
                        onChange={handleCostChange}
                        className="pl-8"
                      />
                    </div>
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
