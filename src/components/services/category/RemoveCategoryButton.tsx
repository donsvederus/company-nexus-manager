
import { ServiceCategory } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface RemoveCategoryButtonProps {
  category: ServiceCategory;
  onRemoveCategory: (category: ServiceCategory) => void;
}

export function RemoveCategoryButton({
  category,
  onRemoveCategory
}: RemoveCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-1 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove the "{category}" category?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onRemoveCategory(category);
              setIsOpen(false);
            }}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
