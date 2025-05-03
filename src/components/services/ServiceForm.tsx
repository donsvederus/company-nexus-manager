
import { useState } from "react";
import { Service, ServiceCategory } from "@/types/service";
import { formatCurrency } from "@/utils/formatUtils";
import { CategoryManager } from "@/components/services/CategoryManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFormProtection } from "@/hooks/useFormProtection";
import { toast } from "sonner";

interface ServiceFormProps {
  service: Service;
  categoryOptions: ServiceCategory[];
  services: any[];
  onSave: (updatedService: Service) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function ServiceForm({
  service,
  categoryOptions,
  services,
  onSave,
  onCancel,
  isNew = false
}: ServiceFormProps) {
  const [name, setName] = useState(service.name);
  const [defaultCost, setDefaultCost] = useState(service.defaultCost.toString());
  const [category, setCategory] = useState<ServiceCategory>(service.category);
  const [description, setDescription] = useState(service.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<ServiceCategory[]>(
    [...new Set([...categoryOptions, ...services.map(s => s.category)])]
  );
  
  // Track if form is dirty (has changes)
  const [isDirty, setIsDirty] = useState(false);
  const { ProtectionDialog } = useFormProtection(isDirty);

  // Track form changes to set dirty state
  useState(() => {
    const isFormDirty = 
      name !== service.name ||
      parseFloat(defaultCost) !== service.defaultCost ||
      category !== service.category ||
      description !== (service.description || "");
    
    setIsDirty(isFormDirty);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Service name is required");
      return;
    }
    
    const costValue = parseFloat(defaultCost);
    if (isNaN(costValue) || costValue < 0) {
      toast.error("Please enter a valid cost");
      return;
    }
    
    setIsLoading(true);
    
    const updatedService: Service = {
      ...service,
      name: name.trim(),
      defaultCost: costValue,
      category,
      description: description.trim() || undefined
    };
    
    onSave(updatedService);
    setIsDirty(false); // Reset dirty state after saving
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsDirty(true);
          }}
          placeholder="Enter service name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <CategoryManager 
          category={category}
          setCategory={(newCat) => {
            setCategory(newCat);
            setIsDirty(true);
          }}
          allCategories={allCategories}
          setAllCategories={setAllCategories}
          categoryOptions={categoryOptions}
          services={services}
          id={service.id}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="defaultCost">
          Default Cost
          {!isNew && service.defaultCost !== parseFloat(defaultCost) && (
            <span className="ml-2 text-sm text-muted-foreground">
              (Current: {formatCurrency(service.defaultCost)})
            </span>
          )}
        </Label>
        <Input
          id="defaultCost"
          type="number"
          step="0.01"
          min="0"
          value={defaultCost}
          onChange={(e) => {
            setDefaultCost(e.target.value);
            setIsDirty(true);
          }}
          placeholder="0.00"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setIsDirty(true);
          }}
          placeholder="Enter service description"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isNew ? "Creating..." : "Saving...") : (isNew ? "Create Service" : "Save Changes")}
        </Button>
      </div>
      
      {/* Render the protection dialog */}
      <ProtectionDialog />
    </form>
  );
}
