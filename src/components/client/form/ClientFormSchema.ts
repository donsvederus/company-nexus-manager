
import { z } from "zod";
import { ClientStatus } from "@/types/client";

// Form schema for client validation
export const clientFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required").max(2, "Use state abbreviation (2 letters)"),
  zipCode: z.string().min(5, "ZIP code is required"),
  accountManager: z.string().min(1, "Account manager is required"),
  mainContact: z.string().min(1, "Main contact is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  status: z.enum(["active", "inactive"] as const),
  website: z.string().optional(),
});

// Type for the form values
export type ClientFormSchemaType = z.infer<typeof clientFormSchema>;
