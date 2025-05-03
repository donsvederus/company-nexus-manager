
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ServiceCategory } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoryManagerProps {
  category: ServiceCategory;
  setCategory: (category: ServiceCategory) => void;
  allCategories: ServiceCategory[];
  setAllCategories: (categories: ServiceCategory[]) => void;
  categoryOptions: ServiceCategory[];
  services: any[];
  id?: string;
}

export function CategoryManager({
  category,
  setCategory,
  allCategories,
  setAllCategories,
  categoryOptions,
  services,
  id
}: CategoryManagerProps) {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryToRemove, setCategoryToRemove] = useState<ServiceCategory | null>(null);
  
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
    setNewCategory("");
    
    toast.success("New category added");
  };

  const handleRemoveCategory = (categoryToRemove: ServiceCategory) => {
    // Check if any services are using this category
    const servicesUsingCategory = services.filter(s => s.category === categoryToRemove);
    
    if (servicesUsingCategory.length > 1 || 
        (servicesUsingCategory.length === 1 && servicesUsingCategory[0].id !== id)) {
      toast.error(`Cannot remove category. It's used by ${servicesUsingCategory.length} ${servicesUsingCategory.length === 1 ? 'service' : 'services'}.`);
      return;
    }
    
    // Remove the category
    setAllCategories(prev => prev.filter(cat => cat !== categoryToRemove));
    
    // If the current service was using this category, change it to "other"
    if (category === categoryToRemove) {
      setCategory("other");
    }
    
    toast.success("Category removed successfully");
    setCategoryToRemove(null);
  };

  const isCategoryRemovable = (cat: ServiceCategory) => {
    // Default categories cannot be removed
    if (categoryOptions.includes(cat)) {
      return false;
    }
    
    // Check if any other services use this category except the current one
    return !services.some(s => s.category === cat && s.id !== id);
  };

  return (
    <>
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
                        <SelectItem 
                          key={cat} 
                          value={cat}
                          className="capitalize flex justify-between items-center"
                        >
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
          
          {category && !categoryOptions.includes(category) && isCategoryRemovable(category) && (
            <AlertDialog>
              <AlertDialog.Trigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-1 text-destructive"
                  onClick={() => setCategoryToRemove(category)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </AlertDialog.Trigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove the "{category}" category?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setCategoryToRemove(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleRemoveCategory(category)}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
    </>
  );
}
