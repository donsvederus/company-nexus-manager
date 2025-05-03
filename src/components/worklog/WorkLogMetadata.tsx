
import { WorkLog } from "@/types/client";
import { format, formatDistanceToNow } from "date-fns";
import { useTimeTracking } from "@/hooks/useTimeTracking";

interface WorkLogMetadataProps {
  log: WorkLog;
}

export function WorkLogMetadata({ log }: WorkLogMetadataProps) {
  const { elapsed } = useTimeTracking(
    log.startTime, 
    log.endTime, 
    log.duration || 0
  );

  // Helper function to format minutes to HH:MM:SS
  const formatMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  };

  // Calculate elapsed time for display
  const getElapsedTime = () => {
    if (log.startTime && !log.endTime) {
      // Active tracking - the useTimeTracking hook handles it
      return elapsed;
    } else if (log.duration && log.duration > 0) {
      // Completed tracking - just display the total duration
      return formatMinutesToTime(log.duration);
    }
    return "00:00:00";
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
      
      {(log.startTime || log.duration) && (
        <div>
          <p className="text-xs font-medium">Duration</p>
          <p className="text-xs font-mono">{getElapsedTime()}</p>
        </div>
      )}
    </div>
  );
}

export default WorkLogMetadata;
