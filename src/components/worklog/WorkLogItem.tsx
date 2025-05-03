import { useState, useEffect } from "react";
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDuration, intervalToDuration } from "date-fns";
import WorkLogMetadata from "./WorkLogMetadata";
import WorkLogForm from "./WorkLogForm";
import WorkLogItemControls from "./WorkLogItemControls";
import WorkLogItemActions from "./WorkLogItemActions";
import WorkLogRecurrenceDialog from "./WorkLogRecurrenceDialog";

interface WorkLogItemProps {
  log: WorkLog;
  onUpdate: (log: WorkLog) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onToggleRecurring: (id: string, recurring: boolean) => void;
  onSetRecurrenceSchedule?: (id: string, recurrenceType: string, nextDate?: Date) => void;
}

type RecurrenceType = "daily" | "weekly" | "biweekly" | "monthly" | "yearly";

export function WorkLogItem({ 
  log, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onToggleComplete,
  onToggleRecurring,
  onSetRecurrenceSchedule
}: WorkLogItemProps) {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<string>("");
  const [description, setDescription] = useState<string>(log.description || "");
  const [notes, setNotes] = useState<string>(log.notes || "");
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  
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

  const handleRecurrenceDialogOpen = () => {
    setShowRecurrenceDialog(true);
  };

  const handleSetRecurrenceSchedule = (recurrenceType: RecurrenceType, nextDate?: Date) => {
    if (onSetRecurrenceSchedule) {
      onSetRecurrenceSchedule(log.id, recurrenceType, nextDate);
    }
    onToggleRecurring(log.id, true);
    setShowRecurrenceDialog(false);
  };

  const handleToggleComplete = () => {
    onToggleComplete(log.id, !log.completed);
  };

  const handleDuplicate = () => {
    onDuplicate(log.id);
  };

  const handleDelete = () => {
    onDelete(log.id);
  };

  const cardClassName = log.completed 
    ? "border-l-2 border-l-gray-400 opacity-75" 
    : "border-l-2 border-l-brand-600";

  return (
    <Card className={cardClassName}>
      <CardContent className="pt-4 pb-2">
        <div className="grid gap-3 md:grid-cols-3">
          <WorkLogForm 
            description={description}
            notes={notes}
            onDescriptionChange={handleDescriptionChange}
            onNotesChange={handleNotesChange}
            disabled={!!log.completed}
            logId={log.id}
          />
          
          <div className="space-y-2">
            <WorkLogMetadata 
              createdAt={log.createdAt}
              startTime={log.startTime}
              elapsedTime={elapsed}
            />
            
            <WorkLogItemControls 
              isTracking={isTracking}
              completed={!!log.completed}
              onStartTracking={handleStartTracking}
              onStopTracking={handleStopTracking}
              onToggleComplete={handleToggleComplete}
              endTimeExists={!!log.endTime}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end gap-2 py-1">
        <WorkLogItemActions 
          isRecurring={!!log.recurring}
          completed={!!log.completed}
          recurrenceType={log.recurrenceType}
          nextRecurrenceDate={log.nextRecurrenceDate}
          onOpenRecurrenceDialog={handleRecurrenceDialogOpen}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />

        <WorkLogRecurrenceDialog 
          open={showRecurrenceDialog}
          onOpenChange={setShowRecurrenceDialog}
          onSetRecurrence={handleSetRecurrenceSchedule}
        />
      </CardFooter>
    </Card>
  );
}

export default WorkLogItem;
