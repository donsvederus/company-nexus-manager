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
import { 
  DollarSign, 
  Plus, 
  Save, 
  Trash2, 
  Copy, 
  Globe, 
  EyeOff, 
  Eye, 
  PlusCircle 
} from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
    getServiceDetails,
    duplicateClientService,
    toggleClientServiceStatus
  } = useServices();
  
  const [client, setClient] = useState(id ? getClientById(id) : null);
  const [clientServices, setClientServices] = useState<ClientService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [customCost, setCustomCost] = useState<number | ''>('');
  const [serviceNotes, setServiceNotes] = useState<string>('');
  const [serviceDomain, setServiceDomain] = useState<string>('');
  const [showInactiveServices, setShowInactiveServices] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  
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
    setServiceDomain(clientService?.domain || client?.website || '');
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
          notes: serviceNotes || undefined,
          domain: serviceDomain || undefined
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
          notes: serviceNotes || undefined,
          domain: serviceDomain || undefined,
          isActive: true
        };
        
        addClientService(newClientService);
        
        // Refresh client services
        setClientServices(getClientServices(client.id));
      }
      
      // Reset editing state
      setEditingService(null);
      setCustomCost('');
      setServiceNotes('');
      setServiceDomain('');
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
  
  const handleDuplicate = (clientServiceId: string) => {
    duplicateClientService(clientServiceId);
    
    // Refresh client services list
    if (client) {
      setClientServices(getClientServices(client.id));
    }
    
    toast.success("Service duplicated");
  };
  
  const handleToggleStatus = (clientServiceId: string, currentStatus: boolean) => {
    toggleClientServiceStatus(clientServiceId, !currentStatus);
    
    // Refresh client services list
    if (client) {
      setClientServices(getClientServices(client.id));
    }
  };
  
  const addNewService = (serviceId: string) => {
    if (!client) return;
    
    const newClientService: Omit<ClientService, "id"> = {
      clientId: client.id,
      serviceId: serviceId,
      domain: client.website || undefined,
      isActive: true
    };
    
    addClientService(newClientService);
    
    // Refresh client services list
    setClientServices(getClientServices(client.id));
    toast.success("Service added successfully");
  };
  
  const saveChanges = () => {
    if (!client) return;
    
    // For each selected service that doesn't exist yet, create it
    for (const serviceId of selectedServices) {
      const existingService = clientServices.find(cs => cs.serviceId === serviceId);
      
      if (!existingService) {
        const newClientService: Omit<ClientService, "id"> = {
          clientId: client.id,
          serviceId: serviceId,
          domain: client.website || undefined,
          isActive: true
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

  const getDisplayClientServices = () => {
    if (!showInactiveServices) {
      return clientServices.filter(cs => cs.isActive);
    }
    return clientServices;
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

      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Services</TabsTrigger>
          <TabsTrigger value="add">Add New Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Client Services</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowInactiveServices(!showInactiveServices)}
              >
                {showInactiveServices ? (
                  <>
                    <EyeOff className="h-4 w-4" /> Hide Inactive
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Show Inactive
                  </>
                )}
              </Button>
            </div>
          </div>

          {getDisplayClientServices().length === 0 ? (
            <Card>
              <CardContent className="text-center p-6">
                <p className="text-muted-foreground mb-4">No {showInactiveServices ? "" : "active"} services assigned to this client</p>
                <Button onClick={() => setActiveTab("add")} className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Add Services
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Default Cost</TableHead>
                      <TableHead>Custom Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-40">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getDisplayClientServices().map((clientService) => {
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
                                {clientService.customCost !== undefined ? (
                                  <div className="flex items-center gap-2">
                                    {formatCurrency(clientService.customCost)}
                                    {clientService.customCost !== service.defaultCost && (
                                      <Badge variant="outline" className="text-xs">Custom</Badge>
                                    )}
                                  </div>
                                ) : formatCurrency(service.defaultCost)}
                                {clientService.notes && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Note: {clientService.notes}
                                  </div>
                                )}
                              </>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={clientService.isActive ? "default" : "secondary"} 
                              className={clientService.isActive ? "bg-green-500 hover:bg-green-600" : ""}>
                              {clientService.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Button size="sm" variant="outline" onClick={saveCustomCost} className="flex items-center gap-1">
                                <Save className="h-4 w-4" /> Save
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => startEditing(clientService.serviceId)}
                                >
                                  Edit
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDuplicate(clientService.id)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleToggleStatus(clientService.id, clientService.isActive)}
                                >
                                  {clientService.isActive ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                                
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
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Services</CardTitle>
              <CardDescription>
                Select services to add to this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => {
                  const isAssigned = clientServices.some(cs => cs.serviceId === service.id && cs.isActive);
                  
                  return (
                    <Card key={service.id} className={`border ${isAssigned ? 'border-green-300 bg-green-50' : ''}`}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{service.name}</CardTitle>
                        <Badge variant="outline" className="capitalize w-fit">
                          {service.category}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-sm text-muted-foreground mb-2">
                          {service.description || "No description available"}
                        </div>
                        <div className="font-bold mb-4">
                          {formatCurrency(service.defaultCost)}
                          <span className="text-xs text-muted-foreground ml-1">default</span>
                        </div>
                        <Button 
                          className="w-full" 
                          variant={isAssigned ? "outline" : "default"}
                          onClick={() => addNewService(service.id)}
                          disabled={isAssigned}
                        >
                          {isAssigned ? "Already Added" : "Add Service"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
