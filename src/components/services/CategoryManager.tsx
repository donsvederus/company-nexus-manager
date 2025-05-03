
import { useState } from "react";
import { ServiceCategory } from "@/types/service";
import { CategorySelection } from "./category/CategorySelection";
import { NewCategoryInput } from "./category/NewCategoryInput";
import { useCategoryManager } from "./category/useCategoryManager";

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
  
  const { isCategoryRemovable, handleRemoveCategory, handleAddNewCategory } = useCategoryManager({
    categoryOptions,
    services,
    id
  });
  
  const onAddNewClick = () => {
    setShowNewCategoryInput(true);
  };
  
  const onAddCategory = () => {
    handleAddNewCategory(
      newCategory,
      allCategories, 
      setAllCategories,
      setCategory,
      setShowNewCategoryInput,
      setNewCategory
    );
  };
  
  const onCancel = () => {
    setShowNewCategoryInput(false);
    setNewCategory("");
  };
  
  const onRemoveCategory = (categoryToRemove: ServiceCategory) => {
    handleRemoveCategory(
      categoryToRemove, 
      category, 
      setCategory, 
      allCategories, 
      setAllCategories
    );
  };

  return (
    <>
      {!showNewCategoryInput ? (
        <CategorySelection
          category={category}
          setCategory={setCategory}
          allCategories={allCategories}
          categoryOptions={categoryOptions}
          onAddNewClick={onAddNewClick}
          isCategoryRemovable={isCategoryRemovable}
          onRemoveCategory={onRemoveCategory}
        />
      ) : (
        <NewCategoryInput
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          onAddCategory={onAddCategory}
          onCancel={onCancel}
        />
      )}
    </>
  );
}
