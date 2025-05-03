
import React, { createContext, useState, useEffect } from "react";
import { ServiceContextType } from "./types";
import { initialServices, initialClientServices } from "./initialData";
import { createServiceOperations } from "./serviceOperations";
import { createClientServiceOperations } from "./clientServiceOperations";
import { Service, ClientService } from "@/types/service";

export const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

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

  // Service operations
  const serviceOps = createServiceOperations(services, setServices);
  
  // Client service operations 
  const clientServiceOps = createClientServiceOperations(clientServices, setClientServices);
  
  // Ensure deleteService also removes any associated client services
  const deleteService = (id: string) => {
    serviceOps.deleteService(id);
    // Also remove any client services associated with this service
    setClientServices((prevClientServices) => 
      prevClientServices.filter((cs) => cs.serviceId !== id)
    );
  };
  
  // Rename getServiceDetails to make it clearer
  const getServiceDetails = (serviceId: string) => {
    return serviceOps.getServiceById(serviceId);
  };

  const value = {
    services,
    clientServices,
    addService: serviceOps.addService,
    updateService: serviceOps.updateService,
    deleteService,
    getServiceById: serviceOps.getServiceById,
    addClientService: clientServiceOps.addClientService,
    updateClientService: clientServiceOps.updateClientService,
    deleteClientService: clientServiceOps.deleteClientService,
    getClientServices: clientServiceOps.getClientServices,
    getActiveClientServices: clientServiceOps.getActiveClientServices,
    getServiceDetails,
    duplicateClientService: clientServiceOps.duplicateClientService,
    toggleClientServiceStatus: clientServiceOps.toggleClientServiceStatus
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};
