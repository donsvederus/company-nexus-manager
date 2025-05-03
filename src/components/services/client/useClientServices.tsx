
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/context/client";
import { useServices } from "@/context/services";
import { toast } from "sonner";
import { ClientService } from "@/types/service";
import { Client } from "@/types/client";

export const useClientServices = () => {
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
  
  const [client, setClient] = useState<Client | null>(id ? getClientById(id) : null);
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

  return {
    client,
    services,
    clientServices,
    selectedServices,
    activeTab,
    setActiveTab,
    handleSaveCustomCost,
    handleDelete,
    handleDuplicate,
    handleToggleStatus,
    addNewService,
    saveChanges,
    getServiceDetails
  };
};
