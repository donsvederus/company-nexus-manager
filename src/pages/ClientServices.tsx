
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import { useServices } from "@/context/ServiceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Plus, Save, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Service, ClientService } from "@/types/service";

export default function ClientServices() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById } = useClients();
  const { 
    services, 
    addClientService, 
    updateClientService,
    deleteClientService,
    getClientServices,
    getServiceDetails
  } = useServices();
  
  const [client, setClient] = useState(id ? getClientById(id) : null);
  const [clientServices, setClientServices] = useState<ClientService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [customCost, setCustomCost] = useState<number | ''>('');
  const [serviceNotes, setServiceNotes] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      const foundClient = getClientById(id);
      if (foundClient) {
        setClient(foundClient);
        const services = getClientServices(id);
        setClientServices(services);
        
        // Pre-select services that the client already has
        const existingServiceIds = services.map(cs => cs.serviceId);
        setSelectedServices(existingServiceIds);
      } else {
        toast.error("Client not found");
        navigate("/clients");
      }
    }
  }, [id, getClientById, getClientServices, navigate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const handleServiceSelect = (serviceId: string, isChecked: boolean) => {
    if (isChecked) {
      // If service is already assigned, don't add it again
      if (!clientServices.some(cs => cs.serviceId === serviceId)) {
        setSelectedServices([...selectedServices, serviceId]);
      }
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };
  
  const getClientService = (serviceId: string) => {
    return clientServices.find(cs => cs.serviceId === serviceId);
  };
  
  const startEditing = (serviceId: string) => {
    const clientService = getClientService(serviceId);
    setEditingService(serviceId);
    setCustomCost(clientService?.customCost ?? '');
    setServiceNotes(clientService?.notes ?? '');
  };
  
  const saveCustomCost = () => {
    if (editingService && client) {
      const existingService = getClientService(editingService);
      const serviceDetails = getServiceDetails(editingService);
      
      if (existingService) {
        // Update existing client service
        const updatedService = {
          ...existingService,
          customCost: customCost === '' ? undefined : Number(customCost),
          notes: serviceNotes || undefined
        };
        updateClientService(updatedService);
        
        // Update local state
        setClientServices(prev => 
          prev.map(cs => cs.id === existingService.id ? updatedService : cs)
        );
      } else if (serviceDetails) {
        // Add new client service
        const newClientService: Omit<ClientService, "id"> = {
          clientId: client.id,
          serviceId: editingService,
          customCost: customCost === '' ? undefined : Number(customCost),
          notes: serviceNotes || undefined
        };
        
        addClientService(newClientService);
        
        // Refresh client services
        setClientServices(getClientServices(client.id));
      }
      
      // Reset editing state
      setEditingService(null);
      setCustomCost('');
      setServiceNotes('');
    }
  };
  
  const handleDelete = (clientServiceId: string) => {
    deleteClientService(clientServiceId);
    
    // Remove from selected services
    const deletedService = clientServices.find(cs => cs.id === clientServiceId);
    if (deletedService) {
      setSelectedServices(prev => prev.filter(id => id !== deletedService.serviceId));
    }
    
    // Refresh client services list
    if (client) {
      setClientServices(getClientServices(client.id));
    }
  };
  
  const saveChanges = () => {
    if (!client) return;
    
    // For each selected service that doesn't exist yet, create it
    for (const serviceId of selectedServices) {
      const existingService = clientServices.find(cs => cs.serviceId === serviceId);
      
      if (!existingService) {
        const newClientService: Omit<ClientService, "id"> = {
          clientId: client.id,
          serviceId: serviceId
        };
        
        addClientService(newClientService);
      }
    }
    
    // For each existing client service that's not selected anymore, delete it
    for (const cs of clientServices) {
      if (!selectedServices.includes(cs.serviceId)) {
        deleteClientService(cs.id);
      }
    }
    
    // Refresh client services
    setClientServices(getClientServices(client.id));
    toast.success("Services updated successfully");
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading client services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Services: {client.companyName}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/clients/${client.id}`)}>
            Back to Client
          </Button>
          <Button onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Client Services</CardTitle>
          <CardDescription>
            Select services to assign to this client and customize costs if needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Default Cost</TableHead>
                <TableHead>Custom Cost</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const clientService = getClientService(service.id);
                const isSelected = selectedServices.includes(service.id);
                const isEditing = editingService === service.id;
                
                return (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          handleServiceSelect(service.id, checked === true);
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(service.defaultCost)}</TableCell>
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
                          <Input
                            placeholder="Notes (optional)"
                            value={serviceNotes}
                            onChange={(e) => setServiceNotes(e.target.value)}
                          />
                        </div>
                      ) : (
                        <>
                          {clientService?.customCost !== undefined ? (
                            <div className="flex items-center gap-2">
                              {formatCurrency(clientService.customCost)}
                              {clientService.customCost !== service.defaultCost && (
                                <Badge variant="outline" className="text-xs">Custom</Badge>
                              )}
                            </div>
                          ) : isSelected ? formatCurrency(service.defaultCost) : '-'}
                          {clientService?.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Note: {clientService.notes}
                            </div>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Button size="sm" variant="outline" onClick={saveCustomCost} className="flex items-center gap-1">
                          <Save className="h-4 w-4" /> Save
                        </Button>
                      ) : isSelected ? (
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditing(service.id)}
                            className="flex items-center gap-1"
                          >
                            {clientService?.customCost !== undefined ? "Edit" : "Add Custom"}
                          </Button>
                          
                          {clientService && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this service from the client?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(clientService.id)} 
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
