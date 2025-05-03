import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Client, ClientFormData, ClientStatus, ClientFormValues } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useFormProtection } from "@/hooks/useFormProtection";

// Update the form schema to include website and separate address fields
const formSchema = z.object({
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
  
  // Split the address into components for editing if we have defaultValues
  const getDefaultAddressValues = () => {
    if (!defaultValues) return { street: "", city: "", state: "", zipCode: "" };

    // If we have legacy data with a single address field, try to parse it
    if (defaultValues.street === undefined && defaultValues.address) {
      const addressParts = defaultValues.address.split(',').map(part => part.trim());
      return {
        street: addressParts[0] || "",
        city: addressParts.length > 1 ? addressParts[1] : "",
        state: addressParts.length > 2 ? addressParts[2].split(' ')[0] : "",
        zipCode: addressParts.length > 2 ? addressParts[2].split(' ')[1] || "" : ""
      };
    }

    // Otherwise use the defined fields
    return {
      street: defaultValues.street || "",
      city: defaultValues.city || "",
      state: defaultValues.state || "",
      zipCode: defaultValues.zipCode || ""
    };
  };

  const addressValues = getDefaultAddressValues();
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          street: addressValues.street,
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
    // Convert date to ISO string for consistency
    const formattedData: ClientFormData = {
      ...data,
      startDate: data.startDate.toISOString().split("T")[0],
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
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Address fields (replaced single address field with separate fields) */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Address</h3>
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Anytown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" maxLength={2} className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountManager"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Manager</FormLabel>
                    <FormControl>
                      {accountManagers && accountManagers.length > 0 ? (
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select account manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {accountManagers.map((manager) => (
                              <SelectItem key={manager.id} value={manager.name}>
                                {manager.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input 
                          placeholder="Enter account manager name" 
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mainContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter main contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal h-10",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
