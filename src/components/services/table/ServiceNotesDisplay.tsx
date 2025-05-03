
import { Input } from "@/components/ui/input";

interface ServiceNotesDisplayProps {
  isEditing: boolean;
  notes: string;
  onNotesChange?: (value: string) => void;
}

export const ServiceNotesDisplay = ({ 
  isEditing, 
  notes, 
  onNotesChange 
}: ServiceNotesDisplayProps) => {
  if (isEditing) {
    return (
      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => onNotesChange?.(e.target.value)}
      />
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      {notes || "-"}
    </div>
  );
};
