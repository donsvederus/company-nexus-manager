
import { WorkLog } from "@/types/client";
import WorkLogItem from "./WorkLogItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkLogListProps {
  logs: WorkLog[];
  onUpdate: (log: WorkLog) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onToggleRecurring: (id: string, recurring: boolean) => void;
  onSetRecurrenceSchedule?: (id: string, recurrenceType: string, nextDate?: Date) => void;
}

export function WorkLogList({ 
  logs, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onToggleComplete,
  onToggleRecurring,
  onSetRecurrenceSchedule
}: WorkLogListProps) {
  // Sort logs: non-completed and most recent first, then completed logs
  const sortedLogs = [...logs].sort((a, b) => {
    // First sort by completed status
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // Then sort by date (most recent first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {sortedLogs.map(log => (
          <WorkLogItem 
            key={log.id}
            log={log}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onToggleComplete={onToggleComplete}
            onToggleRecurring={onToggleRecurring}
            onSetRecurrenceSchedule={onSetRecurrenceSchedule}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

export default WorkLogList;
