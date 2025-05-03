
import { useState, useEffect } from "react";
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns";
import { Play, Square, Trash2, Copy } from "lucide-react";

interface WorkLogItemProps {
  log: WorkLog;
  onUpdate: (log: WorkLog) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function WorkLogItem({ log, onUpdate, onDelete, onDuplicate }: WorkLogItemProps) {
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

  return (
    <Card className="border-l-4 border-l-brand-600">
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-2 space-y-4">
            <div>
              <Label htmlFor={`description-${log.id}`}>Description</Label>
              <Input
                id={`description-${log.id}`}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter work description"
              />
            </div>
            <div>
              <Label htmlFor={`notes-${log.id}`}>Notes</Label>
              <Textarea
                id={`notes-${log.id}`}
                value={notes}
                onChange={handleNotesChange}
                placeholder="Enter detailed notes about the work performed"
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            {log.startTime && (
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm font-mono">{elapsed || "00:00:00"}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {isTracking ? (
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center gap-1"
                  onClick={handleStopTracking}
                >
                  <Square className="h-4 w-4" /> Stop Tracking
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-1"
                  onClick={handleStartTracking}
                  disabled={!!log.endTime}
                >
                  <Play className="h-4 w-4" /> Start Tracking
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end gap-2 pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDuplicate(log.id)}
          className="flex items-center gap-1"
        >
          <Copy className="h-4 w-4" /> Duplicate
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 flex items-center gap-1"
          onClick={() => onDelete(log.id)}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default WorkLogItem;
