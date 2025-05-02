
export interface ServiceCost {
  id: string;
  name: string;
  defaultCost: number;
  customCost?: number;
  description?: string;
}

export interface ClientService {
  id: string;
  clientId: string;
  serviceId: string;
  customCost?: number;
  notes?: string;
  domain?: string; // Added domain field
  isActive: boolean; // Added isActive field to track active/inactive services
}

export type ServiceCategory = 
  | "hosting"
  | "design"
  | "marketing"
  | "maintenance"
  | "consulting"
  | "other";

export interface Service {
  id: string;
  name: string;
  defaultCost: number;
  category: ServiceCategory;
  description?: string;
}
