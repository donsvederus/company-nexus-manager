
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

interface WorkLogItemActionsProps {
  isRecurring: boolean;
  completed: boolean;
  recurrenceType?: string;
  nextRecurrenceDate?: string;
  onOpenRecurrenceDialog: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function WorkLogItemActions({
  completed,
  onDuplicate,
  onDelete
}: WorkLogItemActionsProps) {
  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onDuplicate}
        className="h-7 text-xs"
        disabled={completed}
      >
        <Copy className="h-3 w-3 mr-1" /> Duplicate
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 text-xs text-red-500 hover:text-red-700"
        onClick={onDelete}
      >
        <Trash2 className="h-3 w-3 mr-1" /> Delete
      </Button>
    </>
  );
}

export default WorkLogItemActions;
