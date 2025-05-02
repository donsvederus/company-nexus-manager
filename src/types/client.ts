
export type ClientStatus = "active" | "inactive" | "reactivated";

export interface Client {
  id: string;
  companyName: string;
  address: string;
  accountManager: string;
  mainContact: string;
  email: string;
  phone: string;
  startDate: string;
  status: ClientStatus;
}

export type ClientFormData = Omit<Client, "id">;
