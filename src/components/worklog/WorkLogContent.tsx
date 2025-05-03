
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WorkLogList from "./WorkLogList";
import EmptyWorkLog from "./EmptyWorkLog";

interface WorkLogContentProps {
  logs: WorkLog[];
  onAdd: () => void;
  onUpdate: (log: WorkLog) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onToggleRecurring: (id: string, recurring: boolean) => void;
  onSetRecurrenceSchedule: (id: string, recurrenceType: string, nextDate?: Date) => void;
}

export function WorkLogContent({
  logs,
  onAdd,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleComplete,
  onToggleRecurring,
  onSetRecurrenceSchedule
}: WorkLogContentProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-xl">Work Log Entries</CardTitle>
        <Button size="sm" onClick={onAdd}>Add New Log</Button>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <EmptyWorkLog onAddLog={onAdd} />
        ) : (
          <WorkLogList 
            logs={logs} 
            onUpdate={onUpdate} 
            onDelete={onDelete} 
            onDuplicate={onDuplicate}
            onToggleComplete={onToggleComplete}
            onToggleRecurring={onToggleRecurring}
            onSetRecurrenceSchedule={onSetRecurrenceSchedule}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default WorkLogContent;
