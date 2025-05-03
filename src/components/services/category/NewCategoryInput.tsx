
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewCategoryInputProps {
  newCategory: string;
  setNewCategory: (value: string) => void;
  onAddCategory: () => void;
  onCancel: () => void;
}

export function NewCategoryInput({
  newCategory,
  setNewCategory,
  onAddCategory,
  onCancel
}: NewCategoryInputProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter new category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        autoFocus
      />
      <Button 
        type="button"
        onClick={onAddCategory}
        className="whitespace-nowrap"
      >
        Add
      </Button>
      <Button 
        type="button"
        variant="ghost"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
