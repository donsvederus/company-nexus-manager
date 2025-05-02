
export type ClientStatus = "active" | "inactive" | "reactivated";

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
}

export type ClientFormData = Omit<Client, "id">;
