
import { Service } from "@/types/service";
import { toast } from "sonner";

export function createServiceOperations(
  services: Service[],
  setServices: React.Dispatch<React.SetStateAction<Service[]>>
) {
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
    toast.success("Service deleted successfully");
  };

  const getServiceById = (id: string) => {
    return services.find((service) => service.id === id);
  };

  return {
    addService,
    updateService,
    deleteService,
    getServiceById
  };
}
