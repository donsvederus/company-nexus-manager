
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/ClientContext";
import { useServices } from "@/context/ServiceContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { CurrentServicesTab } from "@/components/services/CurrentServicesTab";
import { AddServicesTab } from "@/components/services/AddServicesTab";
import { ClientService } from "@/types/service";
import { Settings } from "lucide-react";

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
  
  const handleSaveCustomCost = (
    clientServiceId: string, 
    customCostValue: number | undefined, 
    notes: string, 
    domain: string
  ) => {
    if (!client) return;
    
    // Find the client service by ID to update it
    const existingService = clientServices.find(cs => cs.id === clientServiceId);
    
    if (existingService) {
      // Update existing client service
      const updatedService = {
        ...existingService,
        customCost: customCostValue,
        notes: notes || undefined,
        domain: domain || client.website || undefined // Ensure domain has a value, preferring provided domain but falling back to client website
      };
      
      updateClientService(updatedService);
      
      // Update local state
      setClientServices(prev => 
        prev.map(cs => cs.id === clientServiceId ? updatedService : cs)
      );
      
      toast.success("Service details updated");
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
          <Button 
            variant="outline" 
            onClick={() => navigate("/services")}
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            Manage Service Types
          </Button>
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
        
        <TabsContent value="current">
          <CurrentServicesTab
            client={client}
            clientServices={clientServices}
            getServiceDetails={getServiceDetails}
            onAddClick={() => setActiveTab("add")}
            onSaveCustomCost={handleSaveCustomCost}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </TabsContent>
        
        <TabsContent value="add">
          <AddServicesTab
            services={services}
            clientServices={clientServices}
            onAddNewService={addNewService}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
