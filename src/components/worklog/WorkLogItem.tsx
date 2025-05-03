
import { useState, useEffect } from "react";
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns";
import { Play, Square, Trash2, Copy, Check, Repeat } from "lucide-react";

interface WorkLogItemProps {
  log: WorkLog;
  onUpdate: (log: WorkLog) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onToggleRecurring: (id: string, recurring: boolean) => void;
}

export function WorkLogItem({ 
  log, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onToggleComplete,
  onToggleRecurring
}: WorkLogItemProps) {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<string>("");
  const [description, setDescription] = useState<string>(log.description || "");
  const [notes, setNotes] = useState<string>(log.notes || "");
  
  useEffect(() => {
    let timer: number;
    
    if (isTracking && log.startTime && !log.endTime) {
      timer = window.setInterval(() => {
        const start = new Date(log.startTime!);
        const now = new Date();
        const duration = intervalToDuration({ start, end: now });
        setElapsed(formatDuration(duration));
      }, 1000);
    } else if (log.startTime && log.endTime) {
      const start = new Date(log.startTime);
      const end = new Date(log.endTime);
      const duration = intervalToDuration({ start, end });
      setElapsed(formatDuration(duration));
    }
    
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isTracking, log.startTime, log.endTime]);
  
  useEffect(() => {
    setIsTracking(!!log.startTime && !log.endTime);
    setDescription(log.description || "");
    setNotes(log.notes || "");
  }, [log]);
  
  const handleStartTracking = () => {
    const startTime = new Date().toISOString();
    setIsTracking(true);
    onUpdate({
      ...log,
      startTime,
      updatedAt: new Date().toISOString()
    });
  };
  
  const handleStopTracking = () => {
    const endTime = new Date().toISOString();
    setIsTracking(false);
    
    const start = new Date(log.startTime!);
    const end = new Date(endTime);
    const durationInMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    
    onUpdate({
      ...log,
      endTime,
      duration: durationInMinutes,
      updatedAt: new Date().toISOString()
    });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    onUpdate({
      ...log,
      description: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    onUpdate({
      ...log,
      notes: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const cardClassName = log.completed 
    ? "border-l-2 border-l-gray-400 opacity-75" 
    : "border-l-2 border-l-brand-600";

  return (
    <Card className={cardClassName}>
      <CardContent className="pt-4 pb-2">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="col-span-2 space-y-3">
            <div>
              <Label htmlFor={`description-${log.id}`} className="text-xs">Description</Label>
              <Input
                id={`description-${log.id}`}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter work description"
                className="h-8"
                disabled={log.completed}
              />
            </div>
            <div>
              <Label htmlFor={`notes-${log.id}`} className="text-xs">Notes</Label>
              <Textarea
                id={`notes-${log.id}`}
                value={notes}
                onChange={handleNotesChange}
                placeholder="Enter notes"
                className="min-h-[70px] text-sm"
                disabled={log.completed}
              />
            </div>
          </div>
          
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
                <p className="text-xs font-mono">{elapsed || "00:00:00"}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {!log.completed && isTracking ? (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full flex items-center gap-1"
                  onClick={handleStopTracking}
                >
                  <Square className="h-3 w-3" /> Stop
                </Button>
              ) : !log.completed && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center gap-1"
                  onClick={handleStartTracking}
                  disabled={!!log.endTime || log.completed}
                >
                  <Play className="h-3 w-3" /> Start
                </Button>
              )}

              <Button
                variant={log.recurring ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center gap-1 h-7"
                onClick={() => onToggleRecurring(log.id, !log.recurring)}
                disabled={log.completed}
              >
                <Repeat className="h-3 w-3" /> {log.recurring ? "Recurring" : "Set Recurring"}
              </Button>

              <Button
                variant={log.completed ? "secondary" : "outline"}
                size="sm"
                className="w-full flex items-center gap-1 h-7"
                onClick={() => onToggleComplete(log.id, !log.completed)}
              >
                <Check className="h-3 w-3" /> {log.completed ? "Completed" : "Complete"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end gap-2 py-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDuplicate(log.id)}
          className="h-7 text-xs"
          disabled={log.completed}
        >
          <Copy className="h-3 w-3 mr-1" /> Duplicate
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs text-red-500 hover:text-red-700"
          onClick={() => onDelete(log.id)}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default WorkLogItem;
