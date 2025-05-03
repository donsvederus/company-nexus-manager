
export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  companyName: string;
  address: string;
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
  address: string;
  accountManager: string;
  mainContact: string;
  email: string;
  phone: string;
  startDate: Date; // Use Date object for form interactions
  status: ClientStatus;
  website?: string; // Website domain field
}

export type ClientFormData = Omit<Client, "id">;
