
import { useState } from "react";
import { ServiceCategory } from "@/types/service";
import { toast } from "sonner";

interface UseCategoryManagerProps {
  categoryOptions: ServiceCategory[];
  services: any[];
  id?: string;
}

export function useCategoryManager({
  categoryOptions,
  services,
  id
}: UseCategoryManagerProps) {
  const isCategoryRemovable = (cat: ServiceCategory) => {
    // Default categories cannot be removed
    if (categoryOptions.includes(cat)) {
      return false;
    }
    
    // Check if any other services use this category except the current one
    return !services.some(s => s.category === cat && s.id !== id);
  };

  const handleRemoveCategory = (categoryToRemove: ServiceCategory, 
    category: ServiceCategory,
    setCategory: (category: ServiceCategory) => void,
    allCategories: ServiceCategory[],
    setAllCategories: (categories: ServiceCategory[]) => void) => {
    
    // Check if any services are using this category
    const servicesUsingCategory = services.filter(s => s.category === categoryToRemove);
    
    if (servicesUsingCategory.length > 1 || 
        (servicesUsingCategory.length === 1 && servicesUsingCategory[0].id !== id)) {
      toast.error(`Cannot remove category. It's used by ${servicesUsingCategory.length} ${servicesUsingCategory.length === 1 ? 'service' : 'services'}.`);
      return;
    }
    
    // Remove the category
    setAllCategories(allCategories.filter(cat => cat !== categoryToRemove));
    
    // If the current service was using this category, change it to "other"
    if (category === categoryToRemove) {
      setCategory("other");
    }
    
    toast.success("Category removed successfully");
  };

  const handleAddNewCategory = (
    newCategory: string,
    allCategories: ServiceCategory[],
    setAllCategories: (categories: ServiceCategory[]) => void,
    setCategory: (category: ServiceCategory) => void,
    setShowNewCategoryInput: (show: boolean) => void,
    setNewCategory: (category: string) => void
  ) => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    // Add the new category to our list
    setAllCategories([...allCategories, newCategory]);
    
    // Select the new category
    setCategory(newCategory);
    
    // Hide the input field
    setShowNewCategoryInput(false);
    setNewCategory("");
    
    toast.success("New category added");
  };

  return {
    isCategoryRemovable,
    handleRemoveCategory,
    handleAddNewCategory
  };
}
