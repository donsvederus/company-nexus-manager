
import { Button } from "@/components/ui/button";

interface EmptyWorkLogProps {
  onAddLog: () => void;
}

export function EmptyWorkLog({ onAddLog }: EmptyWorkLogProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-muted-foreground mb-4">No work log entries yet</p>
      <Button onClick={onAddLog}>Create First Entry</Button>
    </div>
  );
}

export default EmptyWorkLog;
