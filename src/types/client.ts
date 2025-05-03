
export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  companyName: string;
  street: string;       // For backward compatibility
  streetLines?: string[]; // New field for multiple street lines
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
  workLogs?: WorkLog[]; // Added work logs
}

// Work log type for tracking time spent on client work
export interface WorkLog {
  id: string;
  clientId: string;
  description: string;
  notes: string;
  startTime?: string; // ISO string when started
  endTime?: string; // ISO string when ended
  duration?: number; // Duration in minutes if manually entered
  completed?: boolean; // Indicates if work is complete
  recurring?: boolean; // Indicates if this is a recurring task
  recurrenceType?: string; // Type of recurrence (daily, weekly, etc.)
  nextRecurrenceDate?: string; // Next date for recurrence
  dueDate?: string; // Added due date field
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Add a form-specific type that uses Date object for the form
export interface ClientFormValues {
  companyName: string;
  street?: string;      // Original field for backward compatibility
  streetLines?: string[]; // New array of street lines
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

// Update ClientFormData to match what we're actually passing from the form
// Make street optional to match what's in ClientFormValues
export type ClientFormData = Omit<Client, "id"> & {
  street?: string;
};
