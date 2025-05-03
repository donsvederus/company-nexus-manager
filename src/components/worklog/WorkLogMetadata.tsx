
import { WorkLog } from "@/types/client";
import { format, formatDistanceToNow } from "date-fns";

interface WorkLogMetadataProps {
  log: WorkLog;
}

export function WorkLogMetadata({ log }: WorkLogMetadataProps) {
  // Calculate elapsed time for display if tracking
  const getElapsedTime = () => {
    if (log.startTime && log.endTime) {
      return formatDuration(new Date(log.startTime), new Date(log.endTime));
    } else if (log.startTime) {
      return formatDuration(new Date(log.startTime), new Date());
    } else if (log.duration) {
      // Format minutes as HH:MM:SS
      const hours = Math.floor(log.duration / 60);
      const minutes = Math.floor(log.duration % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return "00:00:00";
  };

  // Helper function to format duration between two dates
  const formatDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = Math.floor(diffSec % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
      
      {log.startTime && (
        <div>
          <p className="text-xs font-medium">Duration</p>
          <p className="text-xs font-mono">{getElapsedTime()}</p>
        </div>
      )}
    </div>
  );
}

export default WorkLogMetadata;
