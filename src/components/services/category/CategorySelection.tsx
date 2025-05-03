
import { useState } from "react";
import { ServiceCategory } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RemoveCategoryButton } from "./RemoveCategoryButton";

interface CategorySelectionProps {
  category: ServiceCategory;
  setCategory: (category: ServiceCategory) => void;
  allCategories: ServiceCategory[];
  categoryOptions: ServiceCategory[];
  onAddNewClick: () => void;
  isCategoryRemovable: (cat: ServiceCategory) => boolean;
  onRemoveCategory: (category: ServiceCategory) => void;
}

export function CategorySelection({
  category,
  setCategory,
  allCategories,
  categoryOptions,
  onAddNewClick,
  isCategoryRemovable,
  onRemoveCategory
}: CategorySelectionProps) {
  return (
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
        onClick={onAddNewClick}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        New
      </Button>
      
      {category && !categoryOptions.includes(category) && isCategoryRemovable(category) && (
        <RemoveCategoryButton 
          category={category} 
          onRemoveCategory={onRemoveCategory} 
        />
      )}
    </div>
  );
}
