
import { WorkLog } from "@/types/client";
import { format, formatDistanceToNow } from "date-fns";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { Clock, Timer } from "lucide-react";

interface WorkLogMetadataProps {
  log: WorkLog;
}

export function WorkLogMetadata({ log }: WorkLogMetadataProps) {
  const { elapsed } = useTimeTracking(
    log.startTime, 
    log.endTime, 
    log.duration || 0
  );

  // Calculate elapsed time for display
  const getElapsedTime = () => {
    if (log.startTime && !log.endTime) {
      // Active tracking - the useTimeTracking hook handles it
      return elapsed;
    } else if (log.duration && log.duration > 0) {
      // Completed tracking with accumulated duration
      const hours = Math.floor(log.duration / 60);
      const minutes = Math.floor(log.duration % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return "00:00:00";
  };

  // Display accumulated minutes in a more readable format
  const formatAccumulatedTime = () => {
    if (!log.duration) return "0m";
    
    const hours = Math.floor(log.duration / 60);
    const minutes = Math.floor(log.duration % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-2">
      <div>
        <p className="text-xs font-medium">Created</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
        </p>
        <p className="text-xs text-muted-foreground">
          ({formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })})
        </p>
      </div>
      
      <div>
        <p className="text-xs font-medium flex items-center gap-1">
          <Clock className="h-3 w-3" /> Duration
        </p>
        <p className="text-xs font-mono flex items-center gap-2">
          {getElapsedTime()} 
          <span className="text-muted-foreground flex items-center gap-1">
            <Timer className="h-3 w-3" /> 
            {formatAccumulatedTime()} total
          </span>
        </p>
      </div>
    </div>
  );
}

export default WorkLogMetadata;
