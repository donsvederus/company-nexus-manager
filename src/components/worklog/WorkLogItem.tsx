
import { useState } from "react";
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import WorkLogMetadata from "./WorkLogMetadata";
import WorkLogForm from "./WorkLogForm";
import WorkLogItemControls from "./WorkLogItemControls";
import WorkLogItemActions from "./WorkLogItemActions";
import WorkLogRecurrenceDialog from "./WorkLogRecurrenceDialog";
import WorkLogNextRecurrence from "./WorkLogNextRecurrence";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useWorkLogItem } from "@/hooks/useWorkLogItem";

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
  const { elapsed, isTracking } = useTimeTracking(log.startTime, log.endTime);
  
  const {
    description,
    notes,
    showRecurrenceDialog,
    handleStartTracking,
    handleStopTracking,
    handleDescriptionChange,
    handleNotesChange,
    handleRecurrenceDialogOpen,
    handleRecurrenceDialogOpenChange
  } = useWorkLogItem(log, onUpdate);

  const handleSetRecurrenceSchedule = (recurrenceType: RecurrenceType, nextDate?: Date) => {
    if (onSetRecurrenceSchedule) {
      onSetRecurrenceSchedule(log.id, recurrenceType, nextDate);
    }
    onToggleRecurring(log.id, true);
    handleRecurrenceDialogOpenChange(false);
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
          onOpenChange={handleRecurrenceDialogOpenChange}
          onSetRecurrence={handleSetRecurrenceSchedule}
        />
      </CardFooter>
    </Card>
  );
}

export default WorkLogItem;
