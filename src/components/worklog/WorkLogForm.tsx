
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface WorkLogFormProps {
  description: string;
  notes: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  logId: string;
}

export function WorkLogForm({
  description,
  notes,
  onDescriptionChange,
  onNotesChange,
  disabled,
  logId
}: WorkLogFormProps) {
  return (
    <div className="col-span-2 space-y-3">
      <div>
        <Label htmlFor={`description-${logId}`} className="text-xs">Description</Label>
        <Input
          id={`description-${logId}`}
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter work description"
          className="h-8"
          disabled={disabled}
        />
      </div>
      <div>
        <Label htmlFor={`notes-${logId}`} className="text-xs">Notes</Label>
        <Textarea
          id={`notes-${logId}`}
          value={notes}
          onChange={onNotesChange}
          placeholder="Enter notes"
          className="min-h-[70px] text-sm"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default WorkLogForm;
