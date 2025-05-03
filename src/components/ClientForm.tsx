import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Client, ClientFormData, ClientStatus, ClientFormValues } from "@/types/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useFormProtection } from "@/hooks/useFormProtection";
import { clientFormSchema } from "./client/form/ClientFormSchema";
import { BasicInfoFields } from "./client/form/BasicInfoFields";
import { AddressFields } from "./client/form/AddressFields";
import { ContactFields } from "./client/form/ContactFields";
import { CommunicationFields } from "./client/form/CommunicationFields";
import { DateStatusFields } from "./client/form/DateStatusFields";

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  defaultValues?: Client;
  isEditing?: boolean;
}

export default function ClientForm({ 
  onSubmit, 
  defaultValues,
  isEditing = false
}: ClientFormProps) {
  const navigate = useNavigate();
  const { users } = useAuth();
  
  // Make sure accountManagers is always an array, even if users is undefined
  const accountManagers = Array.isArray(users) 
    ? users.filter(user => user.role === "admin" || user.role === "manager") 
    : [];
  
  // Debug logs to track the users data
  console.log("Users data:", users);
  console.log("Account managers:", accountManagers);
  
  // Get default address values from client data
  const getDefaultAddressValues = () => {
    if (!defaultValues) return { 
      street: "", 
      streetLines: [""], 
      city: "", 
      state: "", 
      zipCode: "" 
    };
    
    // Initialize streetLines from the existing street if needed
    let streetLines = defaultValues.streetLines || [];
    if (!streetLines.length && defaultValues.street) {
      streetLines = [defaultValues.street];
    }
    
    // Otherwise use the defined fields
    return {
      street: defaultValues.street || "",
      streetLines: streetLines.length ? streetLines : [""],
      city: defaultValues.city || "",
      state: defaultValues.state || "",
      zipCode: defaultValues.zipCode || ""
    };
  };

  const addressValues = getDefaultAddressValues();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          street: addressValues.street,
          streetLines: addressValues.streetLines,
          city: addressValues.city,
          state: addressValues.state,
          zipCode: addressValues.zipCode,
          startDate: new Date(defaultValues.startDate),
          // Force the account manager to be valid if it's not in the list
          accountManager: accountManagers.some(manager => manager.name === defaultValues.accountManager) 
            ? defaultValues.accountManager 
            : accountManagers.length > 0 ? accountManagers[0].name : "",
        }
      : {
          companyName: "",
          streetLines: [""],
          street: "",
          city: "",
          state: "",
          zipCode: "",
          accountManager: accountManagers.length > 0 ? accountManagers[0].name : "",
          mainContact: "",
          email: "",
          phone: "",
          website: "",
          startDate: new Date(),
          status: "active" as ClientStatus,
        },
  });

  // Check if the form is dirty (has unsaved changes)
  const isDirty = form.formState.isDirty;
  const { ProtectionDialog } = useFormProtection(isDirty);

  // Update form's account manager field if it's not in the list when users data loads
  useEffect(() => {
    if (accountManagers.length > 0 && defaultValues) {
      const currentAccountManager = form.getValues().accountManager;
      const isValidManager = accountManagers.some(manager => manager.name === currentAccountManager);
      
      if (!isValidManager) {
        form.setValue('accountManager', accountManagers[0].name);
      }
    }
  }, [accountManagers, defaultValues, form]);

  const handleSubmit = (data: ClientFormValues) => {
    // Ensure we have backward compatibility with street field
    const streetValue = data.streetLines && data.streetLines.length > 0 
      ? data.streetLines[0] 
      : data.street || "";
      
    let formattedData: ClientFormData = {
      ...data,
      startDate: data.startDate.toISOString().split("T")[0],
      street: streetValue,  // Always set street for backward compatibility
      streetLines: data.streetLines || [streetValue], // Ensure streetLines is always set
    };
    
    onSubmit(formattedData);
  };

  const handleCancel = () => {
    // If form is dirty, the useFormProtection hook will handle the confirmation
    navigate(-1);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Client" : "Add New Client"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <BasicInfoFields />
            <AddressFields />
            <ContactFields />
            <CommunicationFields />
            <DateStatusFields />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
              {isEditing ? "Update Client" : "Add Client"}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {/* Render the protection dialog */}
      <ProtectionDialog />
    </Card>
  );
}
