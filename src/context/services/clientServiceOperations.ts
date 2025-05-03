
import { ClientService } from "@/types/service";
import { toast } from "sonner";

export function createClientServiceOperations(
  clientServices: ClientService[],
  setClientServices: React.Dispatch<React.SetStateAction<ClientService[]>>
) {
  const addClientService = (clientServiceData: Omit<ClientService, "id">) => {
    const newClientService: ClientService = {
      ...clientServiceData,
      id: Date.now().toString(),
      isActive: clientServiceData.isActive !== undefined ? clientServiceData.isActive : true
    };
    setClientServices((prevClientServices) => [...prevClientServices, newClientService]);
    toast.success("Client service added successfully");
  };

  const updateClientService = (updatedClientService: ClientService) => {
    setClientServices((prevClientServices) =>
      prevClientServices.map((cs) =>
        cs.id === updatedClientService.id ? { ...updatedClientService } : cs
      )
    );
    
    // Also update localStorage
    const updatedServices = clientServices.map((cs) => 
      cs.id === updatedClientService.id ? { ...updatedClientService } : cs
    );
    localStorage.setItem("clientServices", JSON.stringify(updatedServices));
    
    toast.success("Client service updated successfully");
  };

  const deleteClientService = (id: string) => {
    setClientServices((prevClientServices) => 
      prevClientServices.filter((cs) => cs.id !== id)
    );
    toast.success("Client service removed successfully");
  };

  const getClientServices = (clientId: string) => {
    return clientServices.filter((cs) => cs.clientId === clientId);
  };
  
  const getActiveClientServices = (clientId: string) => {
    return clientServices.filter((cs) => cs.clientId === clientId && cs.isActive);
  };

  const getServiceDetails = (services: any[], serviceId: string) => {
    return services.find((service) => service.id === serviceId);
  };
  
  const duplicateClientService = (clientServiceId: string) => {
    const serviceToDuplicate = clientServices.find(cs => cs.id === clientServiceId);
    
    if (serviceToDuplicate) {
      // Create a completely new service with a deep copy of values
      const newService: Omit<ClientService, "id"> = {
        clientId: serviceToDuplicate.clientId,
        serviceId: serviceToDuplicate.serviceId,
        customCost: serviceToDuplicate.customCost,
        notes: serviceToDuplicate.notes ? `${serviceToDuplicate.notes} (Copy)` : '(Copy)',
        domain: serviceToDuplicate.domain,
        isActive: serviceToDuplicate.isActive
      };
      
      addClientService(newService);
    }
  };
  
  const toggleClientServiceStatus = (clientServiceId: string, isActive: boolean) => {
    setClientServices(prev => 
      prev.map(cs => 
        cs.id === clientServiceId ? { ...cs, isActive } : cs
      )
    );
    
    toast.success(isActive ? "Service activated" : "Service deactivated");
  };

  return {
    addClientService,
    updateClientService,
    deleteClientService,
    getClientServices,
    getActiveClientServices,
    getServiceDetails,
    duplicateClientService,
    toggleClientServiceStatus
  };
}
