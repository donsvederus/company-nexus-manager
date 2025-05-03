
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { WorkLog } from "@/types/client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import WorkLogItemControls from "./WorkLogItemControls";
import WorkLogItemActions from "./WorkLogItemActions";
import WorkLogMetadata from "./WorkLogMetadata";
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

export function WorkLogItem({ 
  log, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onToggleComplete,
  onToggleRecurring,
  onSetRecurrenceSchedule
}: WorkLogItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    description,
    notes,
    dueDate,
    handleStartTracking,
    handleStopTracking,
    handleDescriptionChange,
    handleNotesChange,
    handleDueDateChange,
  } = useWorkLogItem(log, onUpdate);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    onToggleComplete(log.id, checked);
  };

  const handleToggleComplete = () => {
    onToggleComplete(log.id, !log.completed);
  };
  
  const isTracking = !!log.startTime && !log.endTime;
  const hasEndTime = !!log.endTime;

  return (
    <Card className={cn(
      "transition-all duration-200", 
      log.completed ? "bg-muted" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={log.completed || false} 
              onCheckedChange={handleCheckboxChange}
              className="mt-1"
            />
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                <Input
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Task description..."
                  className={cn(
                    "flex-grow", 
                    log.completed ? "line-through text-muted-foreground" : ""
                  )}
                />
                
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          "h-8 gap-1 whitespace-nowrap",
                          dueDate && new Date(dueDate) < new Date() && !log.completed ? "text-red-500 border-red-200" : ""
                        )}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        {dueDate ? format(dueDate, "MMM d, yyyy") : "Set Due Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={handleDueDateChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-3">
                  <Textarea 
                    value={notes} 
                    onChange={handleNotesChange}
                    placeholder="Add notes here..." 
                    className="min-h-[100px]"
                  />
                </div>
              )}
              
              {log.dueDate && !isExpanded && (
                <div className="mt-1">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      new Date(log.dueDate) < new Date() && !log.completed 
                        ? "border-red-200 text-red-500" 
                        : "border-gray-200 text-muted-foreground"
                    )}
                  >
                    Due: {format(new Date(log.dueDate), "MMMM d, yyyy")}
                  </Badge>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleExpanded}
                    className="h-7 text-xs"
                  >
                    {isExpanded ? "Less" : "More"}
                  </Button>
                  
                  <WorkLogMetadata log={log} />
                </div>
                
                <div className="flex items-center gap-1">
                  <WorkLogItemControls
                    isTracking={isTracking}
                    onStartTracking={handleStartTracking}
                    onStopTracking={handleStopTracking}
                    completed={log.completed || false}
                    onToggleComplete={handleToggleComplete}
                    endTimeExists={hasEndTime}
                  />
                  
                  <WorkLogItemActions
                    isRecurring={log.recurring || false}
                    completed={log.completed || false}
                    recurrenceType={log.recurrenceType}
                    nextRecurrenceDate={log.nextRecurrenceDate}
                    onOpenRecurrenceDialog={() => {}}
                    onDuplicate={() => onDuplicate(log.id)}
                    onDelete={() => onDelete(log.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorkLogItem;
