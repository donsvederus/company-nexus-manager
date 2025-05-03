
import { useState, useEffect } from "react";
import { WorkLog } from "@/types/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns";
import { Play, Square, Trash2, Copy, Check, Repeat, Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [selectedRecurrence, setSelectedRecurrence] = useState<RecurrenceType>("daily");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
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

  const handleSetRecurrenceSchedule = () => {
    if (onSetRecurrenceSchedule) {
      onSetRecurrenceSchedule(log.id, selectedRecurrence, selectedDate);
    }
    onToggleRecurring(log.id, true);
    setShowRecurrenceDialog(false);
  };

  const cardClassName = log.completed 
    ? "border-l-2 border-l-gray-400 opacity-75" 
    : "border-l-2 border-l-brand-600";

  return (
    <Card className={cardClassName}>
      <CardContent className="pt-4 pb-2">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="col-span-2 space-y-3">
            <div>
              <Label htmlFor={`description-${log.id}`} className="text-xs">Description</Label>
              <Input
                id={`description-${log.id}`}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter work description"
                className="h-8"
                disabled={log.completed}
              />
            </div>
            <div>
              <Label htmlFor={`notes-${log.id}`} className="text-xs">Notes</Label>
              <Textarea
                id={`notes-${log.id}`}
                value={notes}
                onChange={handleNotesChange}
                placeholder="Enter notes"
                className="min-h-[70px] text-sm"
                disabled={log.completed}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium">Created</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
              </p>
              <p className="text-xs text-muted-foreground">
                ({formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })})
              </p>
            </div>
            
            {log.startTime && (
              <div>
                <p className="text-xs font-medium">Duration</p>
                <p className="text-xs font-mono">{elapsed || "00:00:00"}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {!log.completed && isTracking ? (
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full flex items-center gap-1"
                  onClick={handleStopTracking}
                >
                  <Square className="h-3 w-3" /> Stop
                </Button>
              ) : !log.completed && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center gap-1"
                  onClick={handleStartTracking}
                  disabled={!!log.endTime || log.completed}
                >
                  <Play className="h-3 w-3" /> Start
                </Button>
              )}

              <Button
                variant={log.completed ? "secondary" : "outline"}
                size="sm"
                className="w-full flex items-center gap-1 h-7"
                onClick={() => onToggleComplete(log.id, !log.completed)}
              >
                <Check className="h-3 w-3" /> {log.completed ? "Completed" : "Complete"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end gap-2 py-1">
        <Button 
          variant={log.recurring ? "default" : "ghost"} 
          size="sm" 
          onClick={handleRecurrenceDialogOpen}
          className="h-7 text-xs"
          disabled={log.completed}
        >
          <Repeat className="h-3 w-3 mr-1" /> {log.recurring ? "Recurring" : "Set Recurring"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDuplicate(log.id)}
          className="h-7 text-xs"
          disabled={log.completed}
        >
          <Copy className="h-3 w-3 mr-1" /> Duplicate
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs text-red-500 hover:text-red-700"
          onClick={() => onDelete(log.id)}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Delete
        </Button>

        {/* Recurrence Dialog */}
        <Dialog open={showRecurrenceDialog} onOpenChange={setShowRecurrenceDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set Recurrence Schedule</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="recurrence-type">Recurrence Type</Label>
                <RadioGroup 
                  id="recurrence-type" 
                  defaultValue={selectedRecurrence} 
                  onValueChange={(value) => setSelectedRecurrence(value as RecurrenceType)}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="biweekly" id="biweekly" />
                    <Label htmlFor="biweekly">Bi-weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly">Yearly</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="start-date"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRecurrenceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSetRecurrenceSchedule}>
                Set Recurrence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default WorkLogItem;
