import React, { createContext, useContext, useState, useEffect } from "react";
import { Service, ClientService } from "@/types/service";
import { toast } from "sonner";

// Sample initial services data
const initialServices: Service[] = [
  {
    id: "1",
    name: "Hosting Cost",
    defaultCost: 10.99,
    category: "hosting",
    description: "Monthly web hosting fee"
  },
  {
    id: "2",
    name: "Domain Cost",
    defaultCost: 14.99,
    category: "hosting",
    description: "Annual domain registration"
  },
  {
    id: "3",
    name: "Email Cost",
    defaultCost: 5.99,
    category: "hosting",
    description: "Monthly email service"
  },
  {
    id: "4",
    name: "Web Design Cost",
    defaultCost: 999.99,
    category: "design",
    description: "One-time website design"
  },
  {
    id: "5",
    name: "Plugin License Cost",
    defaultCost: 49.99,
    category: "maintenance",
    description: "Annual plugin license"
  },
  {
    id: "6",
    name: "Maintenance Cost",
    defaultCost: 75.00,
    category: "maintenance",
    description: "Monthly maintenance service"
  },
  {
    id: "7",
    name: "SEO Cost",
    defaultCost: 299.99,
    category: "marketing",
    description: "Monthly SEO service"
  },
  {
    id: "8",
    name: "PPC Cost",
    defaultCost: 499.99,
    category: "marketing",
    description: "Monthly Pay-Per-Click management"
  },
  {
    id: "9",
    name: "Social Media Cost",
    defaultCost: 349.99,
    category: "marketing",
    description: "Monthly social media management"
  },
  {
    id: "10",
    name: "Consultant Cost",
    defaultCost: 150.00,
    category: "consulting",
    description: "Hourly consulting rate"
  },
  {
    id: "11",
    name: "Other Costs",
    defaultCost: 0,
    category: "other",
    description: "Miscellaneous costs"
  }
];

// Sample client services with updated structure and more entries
const initialClientServices: ClientService[] = [
  {
    id: "1",
    clientId: "1",
    serviceId: "1",
    customCost: 8.99,
    notes: "Discounted hosting plan",
    domain: "acmecorp.com",
    isActive: true
  },
  {
    id: "2",
    clientId: "1",
    serviceId: "2",
    notes: "Using default cost",
    domain: "acmecorp.com",
    isActive: true
  },
  {
    id: "3",
    clientId: "1",
    serviceId: "6",
    customCost: 100.00,
    notes: "Enhanced maintenance package",
    domain: "acmecorp.com",
    isActive: true
  },
  {
    id: "4",
    clientId: "3",
    serviceId: "7",
    customCost: 399.99,
    notes: "Premium SEO package",
    domain: "wayneenterprises.com",
    isActive: true
  },
  // New services for existing clients
  {
    id: "5",
    clientId: "3",
    serviceId: "1",
    customCost: 29.99,
    notes: "Enterprise hosting",
    domain: "wayneenterprises.com",
    isActive: true
  },
  {
    id: "6",
    clientId: "3",
    serviceId: "6",
    customCost: 250.00,
    notes: "Premium maintenance",
    domain: "wayneenterprises.com",
    isActive: true
  },
  // Services for new clients
  {
    id: "7",
    clientId: "4",
    serviceId: "1",
    customCost: 19.99,
    notes: "Custom hosting solution",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "8",
    clientId: "4",
    serviceId: "4",
    notes: "Complete website redesign",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "9",
    clientId: "4",
    serviceId: "7",
    customCost: 499.99,
    notes: "Premium SEO package",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "10",
    clientId: "4",
    serviceId: "8",
    customCost: 799.99,
    notes: "Advanced PPC campaign",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "11",
    clientId: "5",
    serviceId: "1",
    notes: "Standard hosting",
    domain: "oscorp.com",
    isActive: true
  },
  {
    id: "12",
    clientId: "5",
    serviceId: "6",
    customCost: 89.99,
    notes: "Basic maintenance",
    domain: "oscorp.com",
    isActive: true
  },
  {
    id: "13",
    clientId: "5",
    serviceId: "9",
    customCost: 399.99,
    notes: "Social media management",
    domain: "oscorp.com",
    isActive: true
  },
  {
    id: "14",
    clientId: "6",
    serviceId: "1",
    customCost: 24.99,
    notes: "Enhanced hosting",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "15",
    clientId: "6",
    serviceId: "2",
    notes: "Domain registration",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "16",
    clientId: "6",
    serviceId: "4",
    customCost: 1299.99,
    notes: "Custom website design",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "17",
    clientId: "6",
    serviceId: "10",
    customCost: 200.00,
    notes: "Monthly consulting",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "18",
    clientId: "7",
    serviceId: "1",
    notes: "Standard hosting",
    domain: "cyberdyne.com",
    isActive: true
  },
  {
    id: "19",
    clientId: "7",
    serviceId: "3",
    customCost: 9.99,
    notes: "Corporate email hosting",
    domain: "cyberdyne.com",
    isActive: true
  },
  {
    id: "20",
    clientId: "7",
    serviceId: "6",
    customCost: 125.00,
    notes: "Enhanced maintenance",
    domain: "cyberdyne.com",
    isActive: true
  }
];

interface ServiceContextType {
  services: Service[];
  clientServices: ClientService[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => Service | undefined;
  addClientService: (clientService: Omit<ClientService, "id">) => void;
  updateClientService: (clientService: ClientService) => void;
  deleteClientService: (id: string) => void;
  getClientServices: (clientId: string) => ClientService[];
  getActiveClientServices: (clientId: string) => ClientService[];
  getServiceDetails: (serviceId: string) => Service | undefined;
  duplicateClientService: (clientServiceId: string) => void;
  toggleClientServiceStatus: (clientServiceId: string, isActive: boolean) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(() => {
    const savedServices = localStorage.getItem("services");
    return savedServices ? JSON.parse(savedServices) : initialServices;
  });

  const [clientServices, setClientServices] = useState<ClientService[]>(() => {
    const savedClientServices = localStorage.getItem("clientServices");
    
    // Add isActive field to existing client services if missing
    if (savedClientServices) {
      const parsedServices = JSON.parse(savedClientServices);
      const updatedServices = parsedServices.map((cs: any) => ({
        ...cs,
        isActive: cs.isActive !== undefined ? cs.isActive : true
      }));
      return updatedServices;
    }
    
    return initialClientServices;
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem("clientServices", JSON.stringify(clientServices));
  }, [clientServices]);

  const addService = (serviceData: Omit<Service, "id">) => {
    const newService: Service = {
      ...serviceData,
      id: Date.now().toString(),
    };
    setServices((prevServices) => [...prevServices, newService]);
    toast.success("Service added successfully");
  };

  const updateService = (updatedService: Service) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    toast.success("Service updated successfully");
  };

  const deleteService = (id: string) => {
    setServices((prevServices) => prevServices.filter((service) => service.id !== id));
    // Also remove any client services associated with this service
    setClientServices((prevClientServices) => 
      prevClientServices.filter((cs) => cs.serviceId !== id)
    );
    toast.success("Service deleted successfully");
  };

  const getServiceById = (id: string) => {
    return services.find((service) => service.id === id);
  };

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
        cs.id === updatedClientService.id ? updatedClientService : cs
      )
    );
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

  const getServiceDetails = (serviceId: string) => {
    return services.find((service) => service.id === serviceId);
  };
  
  const duplicateClientService = (clientServiceId: string) => {
    const serviceToDuplicate = clientServices.find(cs => cs.id === clientServiceId);
    
    if (serviceToDuplicate) {
      const newService: Omit<ClientService, "id"> = {
        ...serviceToDuplicate,
        notes: serviceToDuplicate.notes ? `${serviceToDuplicate.notes} (Copy)` : '(Copy)',
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

  const value = {
    services,
    clientServices,
    addService,
    updateService,
    deleteService,
    getServiceById,
    addClientService,
    updateClientService,
    deleteClientService,
    getClientServices,
    getActiveClientServices,
    getServiceDetails,
    duplicateClientService,
    toggleClientServiceStatus
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};
