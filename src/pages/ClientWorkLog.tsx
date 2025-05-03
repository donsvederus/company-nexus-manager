
import { useWorkLog } from "@/hooks/useWorkLog";
import { useFormProtection } from "@/hooks/useFormProtection";
import WorkLogHeader from "@/components/worklog/WorkLogHeader";
import WorkLogContent from "@/components/worklog/WorkLogContent";

export default function ClientWorkLog() {
  const { 
    client, 
    workLogs, 
    isDirty,
    handleSaveWorkLogs, 
    handleAddWorkLog, 
    handleDeleteWorkLog, 
    handleDuplicateWorkLog, 
    handleUpdateWorkLog, 
    handleToggleComplete,
    handleToggleRecurring,
    handleSetRecurrenceSchedule
  } = useWorkLog();
  
  // Form protection hooks
  const { ProtectionDialog } = useFormProtection(isDirty);
  
  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Loading work log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WorkLogHeader 
        client={client} 
        onSave={handleSaveWorkLogs} 
      />

      <WorkLogContent
        logs={workLogs}
        onAdd={handleAddWorkLog}
        onUpdate={handleUpdateWorkLog}
        onDelete={handleDeleteWorkLog}
        onDuplicate={handleDuplicateWorkLog}
        onToggleComplete={handleToggleComplete}
        onToggleRecurring={handleToggleRecurring}
        onSetRecurrenceSchedule={handleSetRecurrenceSchedule}
      />
      
      {/* Form protection dialog */}
      <ProtectionDialog />
    </div>
  );
}
