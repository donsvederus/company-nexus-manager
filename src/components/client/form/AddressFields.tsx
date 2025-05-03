
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
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function AddressFields() {
  const form = useFormContext<ClientFormValues>();
  const streetLines = form.watch("streetLines") || [""];

  const addStreetLine = () => {
    const currentLines = form.getValues().streetLines || [""];
    form.setValue("streetLines", [...currentLines, ""], { shouldDirty: true });
  };

  const removeStreetLine = (index: number) => {
    const currentLines = form.getValues().streetLines || [""];
    if (currentLines.length > 1) {
      const newLines = currentLines.filter((_, i) => i !== index);
      form.setValue("streetLines", newLines, { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Address</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>Street</FormLabel>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addStreetLine}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {streetLines.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name={`streetLines.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1 mb-0">
                  <FormControl>
                    <Input placeholder={`Street line ${index + 1}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {streetLines.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStreetLine(index)}
                className="h-10 px-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
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
  );
}
