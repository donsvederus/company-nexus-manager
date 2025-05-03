
import { WorkLog } from "@/types/client";
import WorkLogItem from "./WorkLogItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkLogListProps {
  logs: WorkLog[];
  onUpdate: (log: WorkLog) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function WorkLogList({ logs, onUpdate, onDelete, onDuplicate }: WorkLogListProps) {
  // Sort logs by date, most recent first
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {sortedLogs.map(log => (
          <WorkLogItem 
            key={log.id}
            log={log}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

export default WorkLogList;
