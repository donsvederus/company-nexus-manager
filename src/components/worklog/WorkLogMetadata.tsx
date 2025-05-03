
import { format, formatDistanceToNow } from "date-fns";

interface WorkLogMetadataProps {
  createdAt: string;
  startTime?: string;
  elapsedTime: string;
}

export function WorkLogMetadata({
  createdAt,
  startTime,
  elapsedTime
}: WorkLogMetadataProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-xs font-medium">Created</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(createdAt), "MMM d, yyyy h:mm a")}
        </p>
        <p className="text-xs text-muted-foreground">
          ({formatDistanceToNow(new Date(createdAt), { addSuffix: true })})
        </p>
      </div>
      
      {startTime && (
        <div>
          <p className="text-xs font-medium">Duration</p>
          <p className="text-xs font-mono">{elapsedTime || "00:00:00"}</p>
        </div>
      )}
    </div>
  );
}

export default WorkLogMetadata;
