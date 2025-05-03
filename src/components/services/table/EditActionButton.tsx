
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface EditActionButtonProps {
  onSave: () => void;
}

export const EditActionButton = ({ onSave }: EditActionButtonProps) => {
  return (
    <Button size="sm" variant="outline" onClick={onSave} className="flex items-center gap-1">
      <Save className="h-4 w-4" /> Save
    </Button>
  );
};
