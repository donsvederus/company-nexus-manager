
import { Service, ClientService } from "@/types/service";

export interface ServiceContextType {
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
