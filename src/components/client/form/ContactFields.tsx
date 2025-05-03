
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types/auth";
import { ClientFormValues } from "@/types/client";
import { useAuth } from "@/context/AuthContext";

export function ContactFields() {
  const form = useFormContext<ClientFormValues>();
  const { users } = useAuth();
  
  // Make sure accountManagers is always an array, even if users is undefined
  const accountManagers = Array.isArray(users) 
    ? users.filter(user => user.role === "admin" || user.role === "manager") 
    : [];
    
  return (
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
  );
}
