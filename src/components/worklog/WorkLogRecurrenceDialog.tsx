
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

type RecurrenceType = "daily" | "weekly" | "biweekly" | "monthly" | "yearly";

interface WorkLogRecurrenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetRecurrence: (recurrenceType: RecurrenceType, date?: Date) => void;
}

export function WorkLogRecurrenceDialog({
  open,
  onOpenChange,
  onSetRecurrence
}: WorkLogRecurrenceDialogProps) {
  const [selectedRecurrence, setSelectedRecurrence] = useState<RecurrenceType>("daily");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleSetRecurrence = () => {
    onSetRecurrence(selectedRecurrence, selectedDate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSetRecurrence}>
            Set Recurrence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WorkLogRecurrenceDialog;
