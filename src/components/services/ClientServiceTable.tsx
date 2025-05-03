
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ServiceActionButtons } from "./ServiceActionButtons";
import { Service, ClientService } from "@/types/service";
import { Client } from "@/types/client";
import { ServiceCostDisplay } from "./table/ServiceCostDisplay";
import { DomainDisplay } from "./table/DomainDisplay";
import { ServiceNotesDisplay } from "./table/ServiceNotesDisplay";
import { ServiceStatusBadge } from "./table/ServiceStatusBadge";
import { ServiceCostInput } from "./table/ServiceCostInput";
import { EditActionButton } from "./table/EditActionButton";

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
          
          return (
            <TableRow key={clientService.id} className={!clientService.isActive ? "opacity-60" : ""}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {service.category}
                </Badge>
              </TableCell>
              <TableCell>
                <DomainDisplay 
                  isEditing={isEditing} 
                  domain={serviceDomain} 
                  defaultDomain={client.website || ""}
                  onDomainChange={(value) => setServiceDomain(value)}
                />
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <ServiceCostInput 
                    value={customCost} 
                    onChange={handleCostChange} 
                  />
                ) : (
                  <ServiceCostDisplay 
                    defaultCost={service.defaultCost} 
                    customCost={clientService.customCost} 
                  />
                )}
              </TableCell>
              <TableCell>
                <ServiceNotesDisplay 
                  isEditing={isEditing} 
                  notes={isEditing ? serviceNotes : (clientService.notes || '')} 
                  onNotesChange={(value) => setServiceNotes(value)}
                />
              </TableCell>
              <TableCell>
                <ServiceStatusBadge isActive={clientService.isActive} />
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <EditActionButton onSave={handleSaveCustomCost} />
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
