
import { Button } from "@/components/ui/button";
import { Repeat, Copy, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

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
  isRecurring,
  completed,
  recurrenceType,
  nextRecurrenceDate,
  onOpenRecurrenceDialog,
  onDuplicate,
  onDelete
}: WorkLogItemActionsProps) {
  // Format the nextRecurrenceDate if it exists
  const formattedNextDate = nextRecurrenceDate 
    ? format(new Date(nextRecurrenceDate), "MMM d, yyyy")
    : null;

  return (
    <>
      {isRecurring && (recurrenceType || nextRecurrenceDate) && (
        <div className="flex items-center mr-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {recurrenceType && recurrenceType.charAt(0).toUpperCase() + recurrenceType.slice(1)}
            {formattedNextDate && ` • ${formattedNextDate}`}
          </span>
        </div>
      )}
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
