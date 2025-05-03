
import { useState, useEffect } from "react";
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import WorkLogMetadata from "./WorkLogMetadata";
import WorkLogForm from "./WorkLogForm";
import WorkLogItemControls from "./WorkLogItemControls";
import WorkLogItemActions from "./WorkLogItemActions";
import WorkLogRecurrenceDialog from "./WorkLogRecurrenceDialog";
import WorkLogNextRecurrence from "./WorkLogNextRecurrence";
import { useTimeTracking } from "@/hooks/useTimeTracking";

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
  const [description, setDescription] = useState<string>(log.description || "");
  const [notes, setNotes] = useState<string>(log.notes || "");
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  
  const { elapsed, isTracking } = useTimeTracking(log.startTime, log.endTime);
  
  useEffect(() => {
    setDescription(log.description || "");
    setNotes(log.notes || "");
  }, [log]);
  
  const handleStartTracking = () => {
    const startTime = new Date().toISOString();
    onUpdate({
      ...log,
      startTime,
      updatedAt: new Date().toISOString()
    });
  };
  
  const handleStopTracking = () => {
    const endTime = new Date().toISOString();
    
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

  // Only apply the opacity to completed non-recurring items
  const cardClassName = log.completed && !log.recurring
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
            
            <WorkLogNextRecurrence 
              completed={!!log.completed}
              recurring={!!log.recurring}
              nextRecurrenceDate={log.nextRecurrenceDate}
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
