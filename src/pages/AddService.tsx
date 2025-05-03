
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/context/ServiceContext";
import { Service, ServiceCategory } from "@/types/service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useFormProtection } from "@/hooks/useFormProtection";

const categoryOptions: ServiceCategory[] = [
  "hosting",
  "design",
  "marketing",
  "maintenance",
  "consulting",
  "other"
];

export default function AddService() {
  const navigate = useNavigate();
  const { addService } = useServices();
  
  const [name, setName] = useState("");
  const [defaultCost, setDefaultCost] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("other");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Track if form has user input (is dirty)
  const [isDirty, setIsDirty] = useState(false);
  const { ProtectionDialog } = useFormProtection(isDirty);

  // Track form changes to set dirty state
  useEffect(() => {
    const isFormDirty = 
      name !== "" ||
      defaultCost !== "" ||
      category !== "other" ||
      description !== "";
    
    setIsDirty(isFormDirty);
  }, [name, defaultCost, category, description]);

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
    
    const newService: Omit<Service, "id"> = {
      name: name.trim(),
      defaultCost: costValue,
      category,
      description: description.trim() || undefined
    };
    
    addService(newService);
    setIsDirty(false); // Reset dirty state after saving
    
    setTimeout(() => {
      setIsLoading(false);
      navigate("/services");
    }, 500);
  };

  const handleCancel = () => {
    // If form is dirty, the useFormProtection hook will handle the confirmation
    navigate("/services");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Add New Service</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Enter the new service information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter service name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ServiceCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultCost">Default Cost</Label>
              <Input
                id="defaultCost"
                type="number"
                step="0.01"
                min="0"
                value={defaultCost}
                onChange={(e) => setDefaultCost(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter service description"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Service"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Render the protection dialog */}
      <ProtectionDialog />
    </div>
  );
}
