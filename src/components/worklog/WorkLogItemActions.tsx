
import { Button } from "@/components/ui/button";
import { Repeat, Copy, Trash2 } from "lucide-react";

interface WorkLogItemActionsProps {
  isRecurring: boolean;
  completed: boolean;
  onOpenRecurrenceDialog: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function WorkLogItemActions({
  isRecurring,
  completed,
  onOpenRecurrenceDialog,
  onDuplicate,
  onDelete
}: WorkLogItemActionsProps) {
  return (
    <>
      <Button 
        variant={isRecurring ? "default" : "ghost"} 
        size="sm" 
        onClick={onOpenRecurrenceDialog}
        className="h-7 text-xs"
        disabled={completed}
      >
        <Repeat className="h-3 w-3 mr-1" /> {isRecurring ? "Recurring" : "Set Recurring"}
      </Button>
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
