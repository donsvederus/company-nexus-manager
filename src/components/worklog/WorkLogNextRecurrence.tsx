
import { Calendar } from "lucide-react";
import { format } from "date-fns";

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

  // Format the date in a more user-friendly way
  const formattedDate = format(new Date(nextRecurrenceDate), "MMM d, yyyy");
  
  return (
    <div className="mt-2 text-xs font-medium flex items-center">
      <Calendar className="h-3.5 w-3.5 mr-1 text-brand-600" />
      <span>Next: <span className="font-semibold text-brand-600">{formattedDate}</span></span>
    </div>
  );
}

export default WorkLogNextRecurrence;
