
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/formatUtils";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const categoryOptions: ServiceCategory[] = [
  "hosting",
  "design",
  "marketing",
  "maintenance",
  "consulting",
  "other"
];

export default function ServiceEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getServiceById, updateService } = useServices();
  
  const [service, setService] = useState<Service | null>(null);
  const [name, setName] = useState("");
  const [defaultCost, setDefaultCost] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("other");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [allCategories, setAllCategories] = useState<ServiceCategory[]>(categoryOptions);

  useEffect(() => {
    if (id) {
      const serviceData = getServiceById(id);
      if (serviceData) {
        setService(serviceData);
        setName(serviceData.name);
        setDefaultCost(serviceData.defaultCost.toString());
        setCategory(serviceData.category);
        setDescription(serviceData.description || "");
        
        // Check if the service has a custom category that's not in our default options
        if (!categoryOptions.includes(serviceData.category)) {
          setAllCategories(prev => [...prev, serviceData.category]);
        }
      } else {
        toast.error("Service not found");
        navigate("/services");
      }
    }
  }, [id, getServiceById, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
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
    
    updateService(updatedService);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate(-1);
    }, 500);
  };

  const handleAddNewCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    // Add the new category to our list
    setAllCategories(prev => [...prev, newCategory]);
    
    // Select the new category
    setCategory(newCategory);
    
    // Hide the input field
    setShowNewCategoryInput(false);
    
    toast.success("New category added");
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>
            Update the service information below
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
              {!showNewCategoryInput ? (
                <div className="flex gap-2">
                  <Select
                    value={category}
                    onValueChange={(value) => setCategory(value as ServiceCategory)}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Default Categories</SelectLabel>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                        
                        {/* Show custom categories if any */}
                        {allCategories.filter(cat => !categoryOptions.includes(cat)).length > 0 && (
                          <>
                            <SelectLabel>Custom Categories</SelectLabel>
                            {allCategories
                              .filter(cat => !categoryOptions.includes(cat))
                              .map((cat) => (
                                <SelectItem key={cat} value={cat} className="capitalize">
                                  {cat}
                                </SelectItem>
                              ))}
                          </>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewCategoryInput(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    autoFocus
                  />
                  <Button 
                    type="button"
                    onClick={handleAddNewCategory}
                    className="whitespace-nowrap"
                  >
                    Add
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultCost">
                Default Cost
                {service.defaultCost !== parseFloat(defaultCost) && (
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
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
