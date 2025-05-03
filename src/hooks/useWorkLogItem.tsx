
import { useState, useEffect } from "react";
import { WorkLog } from "@/types/client";

type RecurrenceType = "daily" | "weekly" | "biweekly" | "monthly" | "yearly";

export function useWorkLogItem(log: WorkLog, onUpdate: (log: WorkLog) => void) {
  const [description, setDescription] = useState<string>(log.description || "");
  const [notes, setNotes] = useState<string>(log.notes || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(log.dueDate ? new Date(log.dueDate) : undefined);
  const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false);
  
  useEffect(() => {
    setDescription(log.description || "");
    setNotes(log.notes || "");
    setDueDate(log.dueDate ? new Date(log.dueDate) : undefined);
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

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    onUpdate({
      ...log,
      dueDate: date ? date.toISOString() : undefined,
      updatedAt: new Date().toISOString()
    });
  };

  const handleRecurrenceDialogOpen = () => {
    setShowRecurrenceDialog(true);
  };

  const handleRecurrenceDialogOpenChange = (open: boolean) => {
    setShowRecurrenceDialog(open);
  };

  return {
    description,
    notes,
    dueDate,
    showRecurrenceDialog,
    handleStartTracking,
    handleStopTracking,
    handleDescriptionChange,
    handleNotesChange,
    handleDueDateChange,
    handleRecurrenceDialogOpen,
    handleRecurrenceDialogOpenChange,
  };
}

export default useWorkLogItem;
