
export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  companyName: string;
  street: string;       // Changed from address to street
  city: string;         // Added city field
  state: string;        // Added state field
  zipCode: string;      // Added zip code field
  accountManager: string;
  mainContact: string;
  email: string;
  phone: string;
  startDate: string; // This remains a string in storage
  status: ClientStatus;
  website?: string; // Website domain field
  lastContactDate?: string; // Added last contact date field
  endDate?: string; // Added end date field
}

// Add a form-specific type that uses Date object for the form
export interface ClientFormValues {
  companyName: string;
  street: string;       // Changed from address to street
  city: string;         // Added city field
  state: string;        // Added state field
  zipCode: string;      // Added zip code field
  accountManager: string;
  mainContact: string;
  email: string;
  phone: string;
  startDate: Date; // Use Date object for form interactions
  status: ClientStatus;
  website?: string; // Website domain field
}

export type ClientFormData = Omit<Client, "id">;
