
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ClientFormValues } from "@/types/client";

export function BasicInfoFields() {
  const form = useFormContext<ClientFormValues>();

  return (
    <>
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
    </>
  );
}
