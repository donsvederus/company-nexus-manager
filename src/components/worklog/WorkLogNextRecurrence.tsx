
import { Calendar } from "lucide-react";

interface WorkLogNextRecurrenceProps {
  completed: boolean;
  recurring: boolean;
  nextRecurrenceDate?: string;
}

export function WorkLogNextRecurrence({ 
  completed, 
  recurring, 
  nextRecurrenceDate 
}: WorkLogNextRecurrenceProps) {
  if (!(recurring && nextRecurrenceDate)) {
    return null;
  }

  return (
    <div className="mt-2 text-xs text-muted-foreground flex items-center">
      <Calendar className="h-3 w-3 mr-1" />
      <span>Next: {new Date(nextRecurrenceDate).toLocaleDateString()}</span>
    </div>
  );
}

export default WorkLogNextRecurrence;
