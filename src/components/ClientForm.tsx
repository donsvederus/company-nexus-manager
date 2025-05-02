
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { UserRole } from "@/types/auth";

// Sample account managers data
// In a real app, this would come from an API or context
const initialAccountManagers = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@clientnexus.com",
    phone: "(555) 111-2222",
    username: "janesmith",
    password: "password123",
    role: "manager" as UserRole
  },
  {
    id: "2",
    name: "Michael Johnson",
    email: "michael.johnson@clientnexus.com",
    phone: "(555) 222-3333",
    username: "michaelj",
    password: "password123",
    role: "manager" as UserRole
  },
  {
    id: "3",
    name: "Bruce Wayne",
    email: "bruce.wayne@clientnexus.com",
    phone: "(555) 333-4444",
    username: "brucewayne",
    password: "password123",
    role: "manager" as UserRole
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@clientnexus.com",
    phone: "(555) 000-0000",
    username: "admin",
    password: "admin123",
    role: "admin" as UserRole
  }
];

// Update the form schema to include website
const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
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
  const [accountManagers, setAccountManagers] = useState(initialAccountManagers);
  const [open, setOpen] = useState(false);
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          startDate: new Date(defaultValues.startDate),
        }
      : {
          companyName: "",
          address: "",
          accountManager: "",
          mainContact: "",
          email: "",
          phone: "",
          website: "",
          startDate: new Date(),
          status: "active" as ClientStatus,
        },
  });

  const handleSubmit = (data: ClientFormValues) => {
    // Convert date to ISO string for consistency
    const formattedData: ClientFormData = {
      ...data,
      startDate: data.startDate.toISOString().split("T")[0],
    };
    onSubmit(formattedData);
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
                  <FormLabel>Company Name</FormLabel>
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
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountManager"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Account Manager</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full h-10 justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? accountManagers.find(
                                  (manager) => manager.name === field.value
                                )?.name || field.value
                              : "Select account manager"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search account manager..." />
                          <CommandEmpty>No account manager found.</CommandEmpty>
                          <CommandGroup>
                            {accountManagers.map((manager) => (
                              <CommandItem
                                key={manager.id}
                                value={manager.name}
                                onSelect={() => {
                                  form.setValue("accountManager", manager.name);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    manager.name === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {manager.name}
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({manager.role})
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mainContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Contact</FormLabel>
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
                            variant={"outline"}
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
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
              {isEditing ? "Update Client" : "Add Client"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
