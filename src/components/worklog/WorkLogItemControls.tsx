
import { Button } from "@/components/ui/button";
import { Play, Square, Check } from "lucide-react";

interface WorkLogItemControlsProps {
  isTracking: boolean;
  completed: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onToggleComplete?: () => void;
  endTimeExists?: boolean;
}

export function WorkLogItemControls({
  isTracking,
  completed,
  onStartTracking,
  onStopTracking,
  onToggleComplete = () => {},
  endTimeExists = false
}: WorkLogItemControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      {!completed && isTracking ? (
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full flex items-center gap-1"
          onClick={onStopTracking}
        >
          <Square className="h-3 w-3" /> Stop
        </Button>
      ) : !completed && (
        <Button 
          variant="outline" 
          size="sm"
          className="w-full flex items-center gap-1"
          onClick={onStartTracking}
          disabled={completed}
        >
          <Play className="h-3 w-3" /> Start
        </Button>
      )}

      <Button
        variant={completed ? "secondary" : "outline"}
        size="sm"
        className="w-full flex items-center gap-1 h-7"
        onClick={onToggleComplete}
      >
        <Check className="h-3 w-3" /> {completed ? "Completed" : "Complete"}
      </Button>
    </div>
  );
}

export default WorkLogItemControls;
